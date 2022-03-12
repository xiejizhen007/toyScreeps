interface Memory {
    roomNetworks: {[name: string]: RoomNetworkMemory};
    constructionSites: {[name: Id<ConstructionSite>]: ConstructionSiteMemory};

    // global class memory, like terminalNetwork
    global: {};
}

interface RoomMemory {
    owner: string;              // 房间主人，没有为 ""
    level: number;
    sign: string;               // 给房间签名
    planSign: string;           // 计划的签名

    tick: number;
    dangerous: boolean;         // 有塔，或者有主动防御
    isOutSource?: boolean;
}

interface CreepMemory {
    role: string;
    room: string;
    isNeeded: boolean;
    working?: boolean;
    tempTask?: TempTaskMemory;
    task?: TaskMemory;

    transferTask?: {
        source: string;
        target: string;

        resourceType: ResourceConstant | 'all';
        amount?: number;
    }

    _go?: {                 // 移动缓存
        
    };
}

interface PowerCreepMemory {
    workRoom: string;           // 所驻扎的房间名
    task?: PowerCreepTaskMemory;    // 执行的任务
}

interface PowerCreepTaskMemory {
    type: PowerConstant;
    target?: Id<Structure<StructureConstant>>;
}

interface TaskMemory {
    type: string;
    
    _creep: string;

    _target: {
        _id: string;
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