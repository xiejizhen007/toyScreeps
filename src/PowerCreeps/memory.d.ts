interface PowerCreepMemory {
    role: string;       // Operator, Commander, Executor
    baseRoom: string;   // origin room
    workRoom: string;   // work room name

    // backup
    keepAlive: Id<StructurePowerSpawn>;     // the power spawn id
    target: string;                         // task target, like source, lab, etc... set null when no task
    power: PowerConstant;                   // power type, like regenerate source...
}