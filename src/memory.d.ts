interface Memory {
    roomNetworks: {[name: string]: RoomNetworkMemory};
    constructionSites: {[name: Id<ConstructionSite>]: ConstructionSiteMemory};

    // global class memory, like terminalNetwork
    global: {};
}

interface RoomMemory {
    owner: string;              // 房间主人，没有为 ""
    level: number;              // 空房间为 0
    sign: string;               // 给房间签名

    tick: number;               // 信息更新时的时间
    dangerous: boolean;         // 有塔，或者有主动防御
    isOutSource?: boolean;

    powers: PowerBankInfo[];
    deposits: DepositInfo[];
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

interface PowerCreepMemory {
    role: string;       // Operator, Commander, Executor
    baseRoom: string;   // origin room
    workRoom: string;   // work room name

    // backup
    keepAlive: Id<StructurePowerSpawn>;     // the power spawn id
    task: any;      //
}

interface FlagMemory {
    tick?: number;
    room?: string;
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

// power bank 的信息
interface PowerBankInfo {
    id: Id<StructurePowerBank>;
    amount: number;         // power 数量
    decay: number;          // 还有多久消失
    hits: number;           // 当前血量
    pos: RoomPosition;
    tick: number;
}

// deposit 的信息
interface DepositInfo {
    id: Id<Deposit>
    cooldown: number;       // 上一次的冷却时间
    decay: number;          // 距离消失还有多久
    depositType: DepositConstant;
    pos: RoomPosition;
    tick: number;
}

// 需要视野的房间，以及下发时的时间
interface ObserverInfo {
    tick: number;
    room: string;
}