import { Mem } from "Mem";
import { Priority, ReactionTable, ReactionTarget } from "setting";
import { RoomNetwork } from "./RoomNetwork";

const LabState = {
    'idle': 'idle',
    'loading': 'loading',
    'unloading': 'unloading',
    'working': 'working',
    'boosting': 'boosting',
}

interface LabClusterMemory {
    // lab state
    state: string;
    index: number;

    // bak
    labs: Id<StructureLab>[];
    productLabs: Id<StructureLab>[];
    reactionLabs: Id<StructureLab>[];
    boostLabs: Id<StructureLab>[];

    reaction: {
        lab1ResourceType: ResourceConstant;
        lab2ResourceType: ResourceConstant;

        productResourceType: ResourceConstant;
    }
}

const LabClusterMemoryDefaluts: LabClusterMemory = {
    state: LabState.idle,
    index: 0,

    labs: [],
    productLabs: [],
    reactionLabs: [],
    boostLabs: [],

    reaction: null
};

export class LabCluster {
    roomNetwork: RoomNetwork;
    memory: LabClusterMemory;

    labs: StructureLab[];
    productLabs: StructureLab[];                // 产物
    reactionLabs: StructureLab[];               // 底物

    boostLabs: StructureLab[];                  // 用来 boost 的 lab

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.memory = Mem.wrap(roomNetwork.memory, 'labCluster', LabClusterMemoryDefaluts);

        // this.initMemory();

        this.labs = roomNetwork.labs;
    }

    init(): void {
        this.registeLabs();

        this.work();
    }

    work(): void {
        switch (this.memory.state) {
            case LabState.idle:
                this.idleLab();
                break;
            
            case LabState.loading:
                this.loadingLab();
                break;

            case LabState.unloading:
                this.unloadingLab();
                break;

            case LabState.working:
                this.runReaction();
                break;

            case LabState.boosting:
                break;
            
            default:
                this.memory.state = LabState.idle;
                break;
        }
    }

    private registeLabs(): void {
        this.reactionLabs = _.filter(this.labs, f => {
            let yes = true;
            for (const lab of this.labs) {
                if (!lab.pos.inRangeTo(f, 2)) {
                    yes = false;
                }
            }
        
            if (yes) {
                return f;
            }
        });

        this.productLabs = _.filter(this.labs, f => !this.reactionLabs.includes(f));
    }

    private idleLab(): void {
        this.getTarget();
        if (this.memory.reaction) {
            this.changeLabStateTo(LabState.loading);
        }
    }

    private runReaction(): void {
        const [lab1, lab2] = this.reactionLabs;

        if (!lab1 || !lab2) {
            console.log('runReaction: not reaction lab');
            // this.memory.state = LabState.idle;
            this.changeLabStateTo(LabState.idle);
            return;
        }

        if (lab1.mineralType && lab2.mineralType) {
            for (const lab of this.productLabs) {
                if (lab.cooldown == 0) {
                    const ret = lab.runReaction(lab1, lab2);

                    if (ret == ERR_NOT_ENOUGH_RESOURCES) {
                        // console.log('runReaction return: ' + ret);
                        this.changeLabStateTo(LabState.unloading);
                    } 
                }
            }
        } else {
            // 应该先清空 lab
            this.changeLabStateTo(LabState.unloading);
            this.memory.reaction = null;
        }
    }

    private loadingLab(): void {
        // find target
        this.getTarget();
        const [lab1, lab2] = this.reactionLabs;
        if (!lab1 || !lab2) {
            console.log('loadingLab: not reaction lab');
            this.changeLabStateTo(LabState.idle);
            return;
        }

        // request transport task
        const reaction = this.memory.reaction;
        if (reaction) {
            // console.log('reaction: ' + reaction.lab1ResourceType + ' + ' + reaction.lab2ResourceType);
            if (lab1.mineralType == reaction.lab1ResourceType && lab2.mineralType == reaction.lab2ResourceType) {
                this.changeLabStateTo(LabState.working);
            } else {
                if (!lab1.mineralType) {
                    this.roomNetwork.transportNetwork.requestInput(lab1, Priority.NormalLow, {
                        resourceType: reaction.lab1ResourceType,
                        amount: this.requestLabAmount(lab1, reaction.lab1ResourceType),
                    });
                } else if (!lab2.mineralType) {
                    this.roomNetwork.transportNetwork.requestInput(lab2, Priority.NormalLow, {
                        resourceType: reaction.lab2ResourceType,
                        amount: this.requestLabAmount(lab2, reaction.lab2ResourceType),
                    });
                } else if (lab1.mineralType != reaction.lab1ResourceType || lab2.mineralType != reaction.lab2ResourceType) {
                    this.changeLabStateTo(LabState.unloading);
                }
            }
        }
    }

    private unloadingLab(): void {
        const target = _.find(this.labs, f => f.mineralType);
        if (target) {
            // console.log('lab is unloading');
            this.roomNetwork.transportNetwork.requestOutput(target, Priority.NormalLow, {
                resourceType: target.mineralType
            });
        } else {
            this.changeLabStateTo(LabState.loading);
        }
    }

    private countResourceAmount(resourceType: ResourceConstant): number {
        let amount = 0;
        if (this.roomNetwork.storage) {
            amount += this.roomNetwork.storage.store[resourceType];
        }

        if (this.roomNetwork.terminal) {
            amount += this.roomNetwork.terminal.store[resourceType];
        }

        return amount;
    }

    private requestLabAmount(lab: StructureLab, resourceType: ResourceConstant): number {
        if (lab) {
            return Math.min(lab.store.getFreeCapacity(resourceType), this.countResourceAmount(resourceType));
        } 

        return 0;
    }

    private changeLabStateTo(state: string): void {
        this.memory.state = state;
    }

    private getTarget(): void {
        let n = ReactionTarget.length;
        this.memory.index = this.memory.index == undefined ? 0 : this.memory.index % n;

        const target = ReactionTarget[this.memory.index];
        // console.log('target ' + target.target + ' ' + this.countResourceAmount(target.target) + ' plan amount: ' + target.amount);
        if (this.countResourceAmount(target.target) < target.amount) {
            // if (ReactionTable[target.target])
            const indexTarget = ReactionTable[target.target];
            // console.log('原料: ' + indexTarget[0] + ' ' + indexTarget[1]);
            if (this.countResourceAmount(indexTarget[0]) > 100 && this.countResourceAmount(indexTarget[1]) > 100) {
                this.memory.reaction = {
                    lab1ResourceType: indexTarget[0],
                    lab2ResourceType: indexTarget[1],

                    productResourceType: target.target
                };

                return;
            }
        }


        this.memory.index++;
    }
}