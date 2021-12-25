import { CenterNetwork } from "./CenterNetwork";
import { LinkNetwork } from "./LinkNetwork";

export class RoomNetwork {
    name: string;
    room: Room;             // 由 room 实例化 RoomNetwork

    controller: StructureController;
    level: number;

    spawns: StructureSpawn[];
    extensions: StructureExtension[];

    storage: StructureStorage;
    terminal: StructureTerminal;
    factory: StructureFactory;

    nuker: StructureNuker;
    observer: StructureObserver;
    powerSpawn: StructurePowerSpawn;

    links: StructureLink[];
    labs: StructureLab[];
    towers: StructureTower[];

    sources: Source[];
    mineral: Mineral;
    extractor: StructureExtractor;

    tombstones: Tombstone[];
    drops: Resource[];

    linkNetwork: LinkNetwork;
    centerNetwork: CenterNetwork;

    constructor(room: Room) {
        this.room = room;
        this.name = room.name;
    }
}