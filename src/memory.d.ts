interface RoomMemory {
    _cache?: {
        creeps?: Id<AnyCreep>[];
        structures?: Id<Structure>[];
    }
}

interface CreepMemory {
    role: string;
}