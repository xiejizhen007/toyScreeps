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
    // task?: {
    //     type: string;
    //     target?: string;
    //     targetPos?: RoomPosition;
    //     resourceType?: ResourceConstant;
    //     amount?: number;
    // }
    task?: TaskMemory;
}

interface RoomNetworkMemory {
    room?: string;
    myCreeps?: string[];            // creep name
    networks?: {
        // sources?: {[name: Id<Source>]: {
            // sourceId: Id<Source>;
            // pos: RoomPosition;
            // timeout: number;        // timeout > 300 => spawn harvester
            // creeps?: string[];           // name
            // isoutSource?: boolean;  // 外矿？
        // }}
        sources?: {[name: Id<Source>]: SourceNetworkMemory};
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