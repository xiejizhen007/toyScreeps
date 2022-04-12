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

    transferTask?: {
        source: string;
        target: string;

        resourceType: ResourceConstant | 'all';
        amount?: number;
    }

    task?: {
        type: string;       // 任务类型
        source: string;     // 源 id，物流起源
        target: string;     // 目标 id，物流目标或者是工作目标
        pos: RoomPosition;  // 目标位置

        data?: {
            resourceType: ResourceConstant;
            amount?: number;
        };
    }

    _go?: {                 // 移动缓存
        
    };
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