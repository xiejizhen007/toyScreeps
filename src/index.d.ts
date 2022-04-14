// interface CreepBodySetup {
//     body: BodyPartConstant[];       // 基础的部件
//     limit: number;                  // 总部件等于基础部件的 n 倍
//     ordered?: boolean;              // 是否按顺序 [MOVE, MOVE, CARRY, CARRY] => [MOVE, CARRY, MOVE, CARRY]
//     head?: BodyPartConstant[];      // 在基础部件上添加头部部件，如 tough
//     tail?: BodyPartConstant[];      // 在基础部件上添加尾部部件，如 move, heal
// }

interface IReactionTable {
    [targetResourceType: string]: ResourceConstant[];
}

type StoreStructure = 
    StructureStorage 
    | StructureTerminal 
    | StructureContainer 
    | StructureLink
    | StructureSpawn
    | StructureExtension
    | StructureLab

type EnergyStructure =  StructureStorage 
                        | StructureTerminal
                        | StructureContainer 
                        | StructureLink;




interface IKernel {
    roles: { [creepName: string]: any }             // Role
    roomNetworks: { [roomName: string]: any }        // RoomNetwork
    powerCreeps: { [creepName: string]: any }       // powerCreep
    terminalNetwork: ITerminalNetwork;

    build(): void;
    refresh(): void;
    
    init(): void;
    work(): void;
    finish(): void;
}

declare var Kernel: IKernel;

interface ITerminalNetwork {
    allTerminals: StructureTerminal[];
    readyTerminals: StructureTerminal[];

    memory: any;

    init(): void;
    work(): void;
    
    addRequest(room: string, resourceType: ResourceConstant, amount: number, input: boolean, buy: boolean): void;
}