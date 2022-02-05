import { RoomNetwork } from "./RoomNetwork";
import { Cache } from "Cache";

const LabState = {
    Idle: 0,
    RequestMineral: 1,
    RequestEnergy: 2,
    LoadingLabs: 3,
    Reaction: 4,
    UnloadingLabs: 5,
}

export class LabNetwork {
    name: string;
    roomNetwork: RoomNetwork;
    terminal: StructureTerminal;
    storage: StructureStorage;
    labs: StructureLab[];
    reactionLabs: StructureLab[];
    productLabs: StructureLab[];

    memory: LabNetworkMemory;

    constructor(roomNetwork: RoomNetwork) {
        this.name = "LabNetwork";
        this.roomNetwork = roomNetwork;
        this.terminal = roomNetwork.terminal;
        this.storage = roomNetwork.storage;
        this.labs = roomNetwork.labs;
    }

    work(): void {
        this.separateLab();
    }

    private separateLab(): void {
        this.memory = Cache.getRoomNetworkData(this.roomNetwork.name, this.name);
        if (!this.memory) {
            Cache.setRoomNetworkData(this.roomNetwork.name, this.name, {});
            return;
        }

        if (this.memory.reactionLabs) {
            this.reactionLabs = _.map(this.memory.reactionLabs, function getObj(obj) {
                return Game.getObjectById(obj);
            });
        } else {
            let reactionLabs = [] as StructureLab[];
            for (const rlab of this.labs) {
                let yes = true;
                for (const lab of this.labs) {
                    if (!rlab.pos.inRangeTo(lab, 2)) {
                        yes = false;
                    }
                }
                if (yes) {
                    reactionLabs.push(rlab);
                }
            }

            this.reactionLabs = reactionLabs;
            this.memory.reactionLabs = _.map(reactionLabs, function getId(lab) {
                return lab.id;
            });
        }

        if (this.memory.productLabs) {
            this.productLabs = _.map(this.memory.productLabs, function getObj(obj) {
                return Game.getObjectById(obj);
            });
        } else {
            let productLabs = [] as StructureLab[];
            for (const plab of this.labs) {
                let yes = true;
                for (const lab of this.reactionLabs) {
                    if (lab.id == plab.id) {
                        yes = false;
                    }
                }

                if (yes) {
                    productLabs.push(plab);
                }
            }

            this.productLabs = productLabs;
            this.memory.productLabs = _.map(productLabs, function getId(lab) {
                return lab.id;
            });
        }
    }
    
    private initLabState(): void {
        
    }
}