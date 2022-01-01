interface LabNetworkMemory {
    state: number,
    stateTick: number,
    labs: Id<StructureLab>[];
    reactionLabs: Id<StructureLab>[];
    productLabs: Id<StructureLab>[];
    boostLabs: Id<StructureLab>[];
}

interface RoomNetworkMemory {
    transportNetwork: TransportNetworkRequests[],
}

type TransportNetworkTarget = StructureStorage |
    StructureTerminal | StructureLink | 
    StructureSpawn | StructureExtension | 
    StructureLab | StructureNuker | 
    StructurePowerSpawn;

// 传输网络属性
interface TransportNetworkRequests {
    target: TransportNetworkTarget | string,
    amount: number,
    reosurceType: ResourceConstant,
}

interface TransportNetworkOptions {
    amount?: number,
    reosurceType?: ResourceConstant,
}