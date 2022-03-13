interface CreepBodySetup {
    body: BodyPartConstant[];       // 基础的部件
    limit: number;                  // 总部件等于基础部件的 n 倍
    ordered?: boolean;              // 是否按顺序 [MOVE, MOVE, CARRY, CARRY] => [MOVE, CARRY, MOVE, CARRY]
    head?: BodyPartConstant[];      // 在基础部件上添加头部部件，如 tough
    tail?: BodyPartConstant[];      // 在基础部件上添加尾部部件，如 move, heal
}

interface IReactionTable {
    [targetResourceType: string]: ResourceConstant[];
}

type StoreStructure = StructureStorage | StructureTerminal | StructureContainer | StructureLink;

type EnergyStructure =  StructureStorage 
                        | StructureTerminal
                        | StructureContainer 
                        | StructureLink;




interface IKernal {
    roles: { [creepName: string]: any }             // Role
    roomNetworks: { [roomName: string]: any }        // RoomNetwork

    terminalNetwork: ITerminalNetwork;


    build(): void;
    refresh(): void;
    
    init(): void;
    work(): void;
}

declare var Kernal: IKernal;

interface ITerminalNetwork {
    allTerminals: StructureTerminal[];
    readyTerminals: StructureTerminal[];

    init(): void;
    work(): void;
}