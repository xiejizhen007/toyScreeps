import { RoomNetwork } from "./RoomNetwork";

const LabState = {
    'idle': 'idle',
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
        this.registeLabs();
    }

    work(): void {

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
}