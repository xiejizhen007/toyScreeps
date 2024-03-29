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
    directives: { [flagName: string]: any }         // directives

    terminalNetwork: ITerminalNetwork;
    market: IMarket;
    observer: IObserver;

    build(): void;                  // 实例化各个对象
    refresh(): void;                // 刷新对象，防止对象失效
    
    init(): void;                   // 各模块的初始化
    work(): void;                   // 各模块的相关工作
    finish(): void;                 // 收尾工作
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

interface IObserver {
    powers: PowerBankInfo[];
    deposits: DepositInfo[];

    init(): void;
    work(): void;
    finish(): void;
    refresh(): void;

    registerDirective(directive: any): void;
    removeDirective(directive: any): void;
    registerObserver(base: string, room: string): void;
}