interface Room {
    creeps: Creep[];
    myCreeps: Creep[];
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
    goto(pos: RoomPosition): ScreepsReturnCode;
    withdrawFrom(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;

    sayHello(): void;
}

interface RoomPosition {
    findClosestByLimitedRange<T>(objects: T[] | RoomPosition[], rangeLimit: number, 
                                opts?: { filter: any | string; }): T | undefined;
}