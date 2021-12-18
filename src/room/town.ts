// 小镇

export class Town {
    name: string;                                   // the town name
    room: Room;
    // 
    storage: StructureStorage | undefined;
    terminal: StructureTerminal | undefined;
    factory: StructureFactory | undefined;
    // base structure
    towers: StructureTower[];
    links: StructureLink[];
    extractor: StructureExtractor;
    labs: StructureLab[];
    powerSpawn: StructurePowerSpawn | undefined;
    observer: StructureObserver | undefined;
    nuker: StructureNuker | undefined;
    controller: StructureController;                // town controller

    // keep spawn
    spawns: StructureSpawn[];
    extensions: StructureExtension[];

    sources: Source[];                              // 
    tombstones: Tombstone[];                        // town 内的墓碑，为了之后取墓碑能量
    drops: { [resourceType: string]: Resource[]};   // town 内掉落的资源

    constructor(roomName: string) {
        this.room = Game.rooms[roomName];

    }
}