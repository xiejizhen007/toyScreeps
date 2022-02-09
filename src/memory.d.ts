interface Memory {
    roomNetworks: {[name: string]: RoomNetworkMemory};
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
    task?: {
        type: string;
        target?: string;
        resourceType?: ResourceConstant;
        amount?: number;
    }
}

interface RoomNetworkMemory {
    room?: string;
    myCreeps?: string[];            // creep name
    networks?: {
        // sources?: {
        //     sourceId: Id<Source>;
        //     pos: RoomPosition;
        //     timeout: number;        // timeout > 300 => spawn harvester
        //     creeps?: string[];           // name
        //     isoutSource?: boolean;  // 外矿？
        // }[];
        sources?: {[name: Id<Source>]: {
            sourceId: Id<Source>;
            pos: RoomPosition;
            timeout: number;        // timeout > 300 => spawn harvester
            creeps?: string[];           // name
            isoutSource?: boolean;  // 外矿？
        }}
    }
}