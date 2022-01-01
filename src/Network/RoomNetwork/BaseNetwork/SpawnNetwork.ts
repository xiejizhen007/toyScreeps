import { RoomNetwork } from "../RoomNetwork";
import { BaseNetwork } from "./BaseNetwork";

export class SpawnNetwork extends BaseNetwork {
    spawns: StructureSpawn[];
    availableSpawns: StructureSpawn[];
    extensions: StructureExtension[];

    constructor(roomNetwork: RoomNetwork, spawn: StructureSpawn) {
        super(roomNetwork, spawn, 'SpawnNetwork');

        this.spawns = roomNetwork.spawns;
        this.availableSpawns = _.filter(roomNetwork.spawns, s => !s.spawning);
        this.extensions = roomNetwork.extensions;
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