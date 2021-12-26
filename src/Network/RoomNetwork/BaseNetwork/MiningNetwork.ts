import { RoomNetwork } from "../RoomNetwork";
import { BaseNetwork } from "./BaseNetwork";

export class MiningNetwork extends BaseNetwork {
    mineral: Mineral;

    constructor(roomNetwork: RoomNetwork, mineral: Mineral) {
        super(roomNetwork, mineral, 'MiningNetwork');
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