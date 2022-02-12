interface TaskSetting {
    targetRange: number;
    timeout: number;
}

interface TaskData {
    resourceType?: ResourceConstant;
    amount?: number;
}

interface TaskMemory {
    name: string;
    _creep: {
        name: string;
    };
    _target: {
        id: string;
        pos: RoomPosition;
    };
    tick: number;
    data: TaskData;
}

// task details
type harvestTargetType = Source | Mineral | Deposit;

type transferTargetType = 
    StructureSpawn 
    | StructureExtension
    | StructureStorage
    | StructureTerminal
    | StructureFactory
    | StructureLink
    | Creep
    | StructureNuker
    | StructureLab
    | StructurePowerSpawn
    | StructureContainer;

type withdrawTargetType = 
    StructureSpawn 
    | StructureExtension
    | StructureStorage
    | StructureTerminal
    | StructureFactory
    | StructureLink
    | StructureLab
    | StructureContainer;