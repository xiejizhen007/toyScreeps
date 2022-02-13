interface TaskSetting {
    targetRange: number;
    timeout: number;
    oneShot: boolean
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
    _parent: TaskMemory;
    tick: number;
    data: TaskData;
}

// task details
type buildTargetType = ConstructionSite;

type harvestTargetType = Source | Mineral | Deposit;

type pickupTargetType = Resource;

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

type upgradeTargetType = StructureController;

type withdrawTargetType = 
    StructureSpawn 
    | StructureExtension
    | StructureStorage
    | StructureTerminal
    | StructureFactory
    | StructureLink
    | StructureLab
    | StructureContainer;