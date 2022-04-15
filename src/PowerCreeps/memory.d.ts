interface PowerCreepMemory {
    role: string;       // Operator, Commander, Executor
    baseRoom: string;   // origin room
    workRoom: string;   // work room name

    // backup
    keepAlive: Id<StructurePowerSpawn>;     // the power spawn id
    task: any;      //
}