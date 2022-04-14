import { Mem } from "Mem";

// terminal 资源请求的接口
export interface ITerminalRequest {
    room: string;
    resourceType: ResourceConstant;
    amount: number;
    input: boolean;         // 获取 true，送出 false
    tick: number;           // 设置超时
    buy: boolean;           // 是否允许购买
    state: {
        startAmount: number;        // 发出请求时特定资源的数量
        targetAmount: number;       // 目的数量
    }
}

// 每一个房间的基础矿物
export interface ITerminalMineral {
    room: string;
    mineralType: ResourceConstant;
}

export interface TerminalNetworkMemory {
    queue: {
            origin: string;
            target: string;
            resourceType: ResourceConstant;
            amount: number;
    }[];

    request: ITerminalRequest[];

    minerals: ITerminalMineral[];
}

export const TerminalNetworkMemoryDefault: TerminalNetworkMemory = {
    queue: [],
    request: [],
    minerals: [],
}

export class TerminalNetwork implements ITerminalNetwork {
    allTerminals: StructureTerminal[];
    readyTerminals: StructureTerminal[];
    terminals: StructureTerminal[];

    requests: ITerminalRequest[];
    minerals: ITerminalMineral[];

    memory: TerminalNetworkMemory;

    private TIMEOUT = 5000;

    constructor(terminals: StructureTerminal[]) {
        this.allTerminals = _.clone(terminals);
        this.terminals = _.clone(terminals);

        // 注册 memory 并向全局注册本身
        this.memory = Mem.wrap(Memory, 'terminalNetwork', TerminalNetworkMemoryDefault);
    }

    /**
     * 清除请求
     */
    init(): void {
        this.requests = this.memory.request;
        this.minerals = this.memory.minerals;

        this.memory.request = _.filter(this.memory.request, f => {
            if (f.tick + this.TIMEOUT > Game.time) {
                return false;
            }

            const terminal = Game.rooms[f.room].terminal;
            if (terminal) {
                if (f.input) {
                    return terminal.store[f.resourceType] < f.state.targetAmount;
                } else {
                    return terminal.store[f.resourceType] > f.state.targetAmount;
                }
            }

        });
    }

    work(): void {
        
    }

    finish(): void {
        this.memory.request = this.requests;
        this.memory.minerals = this.minerals;
    }

    addResourceShared(room: string, resourceType: ResourceConstant, amount: number) {
        
    }

    addRequest(room: string, resourceType: ResourceConstant, amount: number, input = true, buy = true) {
        const req = _.find(this.memory.request, f => f.room == room && f.resourceType == resourceType);
        if (!req && Game.rooms[room].terminal) {
            const startAmount = Game.rooms[room].terminal.store[resourceType];
            const targetAmount = input ? amount : -amount;

            this.memory.request.push({
                room: room,
                resourceType: resourceType,
                amount: amount,
                input: input,
                tick: Game.time, 
                buy: buy,
                state: {
                    startAmount: startAmount,
                    targetAmount: startAmount + targetAmount,
                },
            });
        }
    }

    removeRequest(room: string, resourceType: ResourceConstant) {
        _.remove(this.memory.request, f => f.room == room && f.resourceType == resourceType);
    }
}