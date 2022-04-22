interface Room {
    creeps: Creep[];
    // myCreeps: Creep[];
    enemies: Creep[];

    structures: Structure[];

    spawns: StructureSpawn[];
    extensions: StructureExtension[];

    links: StructureLink[];
    towers: StructureTower[];

    constructionSites: ConstructionSite[];

    factory?: StructureFactory;
}

interface Creep {

}

interface RoomPosition {
    findClosestByLimitedRange<T>(objects: T[] | RoomPosition[], rangeLimit: number, 
                                opts?: { filter: any | string; }): T | undefined;
    
    getMemory(): PosMemory;
}

interface PowerCreep {
    work(): void;

    getTask(): void;
    keepAlive(): boolean;
}