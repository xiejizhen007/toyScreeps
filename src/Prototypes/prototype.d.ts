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
    sayHello(): void;

    // task work
    work(): void;


    tasks: any;

    // task type
    transferTo(target: AnyCreep | Structure<StructureConstant>, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
    withdrawFrom(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode;
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