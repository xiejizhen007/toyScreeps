import { RoomNetwork } from "../RoomNetwork";
import { BaseNetwork } from "./BaseNetwork";

export class MineralNetwork extends BaseNetwork {
    mineral: Mineral;
    container: StructureContainer;

    constructor(roomNetwork: RoomNetwork, mineral: Mineral) {
        super(roomNetwork, mineral, 'MineralNetwork');
        this.mineral = mineral;
    }

    refresh(): void {
        
    }

    spawnNetworkCreep(): void {
        
    }

    init(): void {
        
    }

    work(): void {
        
    }
}