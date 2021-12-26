import { RoomNetwork } from "../RoomNetwork";
import { BaseNetwork } from "./BaseNetwork";

export class TowerNetwork extends BaseNetwork {
    towers: StructureTower[];

    constructor(roomNetwork: RoomNetwork, tower: StructureTower) {
        super(roomNetwork, tower, 'TowerNetwork');

        this.towers = roomNetwork.towers;
    }

    refresh(): void {
        
    }

    spawnNetworkCreep(): void {
        
    }

    init(): void {
        
    }

    work(): void {
        
    }

    private attack(creep: Creep): void {
        for (const tower of this.towers) {
            tower.attack(creep);
        }
    }
}