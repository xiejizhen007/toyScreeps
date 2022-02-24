interface Memory {
    roomNetworks: {[name: string]: RoomNetworkMemory};
    constructionSites: {[name: Id<ConstructionSite>]: ConstructionSiteMemory};
}

interface RoomMemory {
    _cache?: {
        creeps?: Id<AnyCreep>[];
        structures?: Id<Structure>[];
    }
}

interface CreepMemory {
    role: string;
    room: string;
    isNeeded: boolean;
    working?: boolean;
    tempTask?: TempTaskMemory;
    // task?: 
}

interface TaskMemory {
    type: string;
    
    _creep: {
        name: string;
    };

    _target: {
        id: string;
        _pos: PosMemory;
    };

    _parent: TaskMemory | null;

    tick: number;
    options: TaskOptions;
    data: TaskData;
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
        lab?: LabClusterMemory;
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


// lab
interface LabClusterMemory {
    // lab state
    state: string;

    // bak
    labs: Id<StructureLab>[];
    productLabs: Id<StructureLab>[];
    reactionLabs: Id<StructureLab>[];
    boostLabs: Id<StructureLab>[];

    reaction: {
        lab1ResourceType: ResourceConstant;
        lab2ResourceType: ResourceConstant;

        productResourceType: ResourceConstant;
    }
}