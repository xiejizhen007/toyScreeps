interface Memory {
    roomNetworks: {[name: string]: RoomNetworkMemory};
    constructionSites: {[name: Id<ConstructionSite>]: ConstructionSiteMemory};
}

interface RoomMemory {
    owner: string;
    tick: number;

    isOutSource?: boolean;
}

interface CreepMemory {
    role: string;
    room: string;
    isNeeded: boolean;
    working?: boolean;
    tempTask?: TempTaskMemory;
    task?: TaskMemory;
}

interface PowerCreepMemory {
    workRoom: string;           // 所驻扎的房间名
    task?: PowerCreepMemory;    // 执行的任务
}

interface PowerCreepTaskMemory {
    type: PowerConstant;
    target?: Id<Structure<StructureConstant>>;
}

interface TaskMemory {
    type: string;
    
    _creep: string;

    _target: {
        _id: Id<AnyCreep | Structure>;
        _pos: PosMemory;
    };

    _parent: TaskMemory | null;

    tick: number;
    options: TaskOptions;
    data: TaskData;
}

interface TaskSettings {
    range: number;
    oneShot: boolean;
    timeout: number;
}

interface TaskOptions {
    nextPos?: PosMemory;
}

interface TaskData {
    resourceType?: ResourceConstant;
    amount?: number;
}

interface TempTaskMemory {
    type: string;
    target?: string;
    targetPos?: RoomPosition;
    resourceType?: ResourceConstant;
    amount?: number;
}

interface RoomNetworkMemory {
    room?: string;
    myCreeps?: string[];            // creep name
    networks?: {
        sources?: {[name: Id<Source>]: SourceNetworkMemory};
        // lab?: LabClusterMemory;
        pcTasks?: any;
    }
}

interface SourceNetworkMemory {
    sourceId: Id<Source>;
    pos: RoomPosition;
    timeout: number;
    creeps: string[];           // name
    isoutSource?: boolean;      // 外矿？
}

interface ConstructionSiteMemory {
    tick: number;
    pos: RoomPosition;
}

interface PosMemory {
    x: number;
    y: number;
    roomName: string;
}


// // lab
// interface LabClusterMemory {
//     // lab state
//     state: string;
//     index: number;

//     // bak
//     labs: Id<StructureLab>[];
//     productLabs: Id<StructureLab>[];
//     reactionLabs: Id<StructureLab>[];
//     boostLabs: Id<StructureLab>[];

//     reaction: {
//         lab1ResourceType: ResourceConstant;
//         lab2ResourceType: ResourceConstant;

//         productResourceType: ResourceConstant;
//     }
// }