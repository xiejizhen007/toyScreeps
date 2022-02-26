import { RoomNetwork } from "./RoomNetwork";

const LabState = {
    'idle': 'idle',
    'loading': 'loading',
    'unloading': 'unloading',
    'working': 'working',
    'boosting': 'boosting',
}

export class LabCluster {
    roomNetwork: RoomNetwork;
    memory: LabClusterMemory;

    labs: StructureLab[];
    productLabs: StructureLab[];                // 产物
    reactionLabs: StructureLab[];               // 底物

    boostLabs: StructureLab[];                  // 用来 boost 的 lab

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.memory = roomNetwork.memory.networks.lab;

        this.labs = roomNetwork.labs;
    }

    init(): void {
        this.initMemory();
        this.registeLabs();
    }

    work(): void {
        // _.defaults(this.memory, {
        //     state: LabState.idle
        // });

        switch (this.memory.state) {
            case LabState.idle:
                break;
            
            case LabState.loading:
                break;

            case LabState.unloading:
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

    private initMemory(): void {
        if (!this.memory) {
            this.memory = {
                state: LabState.idle,

                labs: [],
                reactionLabs: [],
                productLabs: [],
                boostLabs: [],

                reaction: null,
            }
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

    private runReaction(): void {
        const [lab1, lab2] = this.reactionLabs;

        if (!lab1 || !lab2) {
            console.log('runReaction: not reaction lab');
            return;
        }

        for (const lab of this.productLabs) {
            if (lab.cooldown == 0) {
                const ret = lab.runReaction(lab1, lab2);

                if (ret != OK) {
                    console.log('runReaction return: ' + ret);
                }
            }
        }
    }

    private loadingLab(): void {
        
    }
}