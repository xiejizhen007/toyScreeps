// lab 反应表
interface IReactionTable {
    [targetResourceType: string]: ResourceConstant[];
}

interface IFactoryTopProduceTable {
    [ level: number]: ResourceConstant[];
}

interface IKernel {
    roles: { [creepName: string]: any }             // Role
    roomNetworks: { [roomName: string]: any }        // RoomNetwork
    powerCreeps: { [creepName: string]: any }       // powerCreep

    directives: { [flagName: string]: any }             // order

    terminalNetwork: ITerminalNetwork;
    market: IMarket;

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
    finish(): void;
    
    addRequest(room: string, resourceType: ResourceConstant, amount: number, input?: boolean, buy?: boolean): void;
    removeRequest(room: string, resourceType: ResourceConstant): void;
}

interface IMarket {
    memory: any;        // 订单 cache

    init(): void;
    work(): void;
    finish(): void;

    buy(room: string, resourceType: ResourceConstant, amount: number, fast?: boolean): number;
    sell(room: string, resourceType: ResourceConstant, amount: number, fast?: boolean): number;
}