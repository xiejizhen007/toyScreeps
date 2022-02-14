import { RoomNetwork } from "./RoomNetwork";

export class LabCluster {
    roomNetwork: RoomNetwork;

    labs: StructureLab[];
    productLabs: StructureLab[];                // 产物
    reactionLabs: StructureLab[];               // 底物

    boostLabs: StructureLab[];                  // 需要 boost 的

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
    }
}