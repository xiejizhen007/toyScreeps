interface Room {
    creeps: Creep[];
    myCreeps: Creep[];
    structures: Structure[];
    spawns: StructureSpawn[];
    links: StructureLink[];

    constructionSites: ConstructionSite[];

    factory?: StructureFactory;
}

interface Creep {
    goto(pos: RoomPosition): ScreepsReturnCode;
    withdrawFrom(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
}

interface RoomPosition {
    findClosestByLimitedRange<T>(objects: T[] | RoomPosition[], rangeLimit: number, 
                                opts?: { filter: any | string; }): T | undefined;
}