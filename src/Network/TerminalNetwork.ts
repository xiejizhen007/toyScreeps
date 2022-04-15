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

export interface ITerminalShared {
    [resourceType: string]: string[];
}

export interface TerminalNetworkMemory {
    request: ITerminalRequest[];
    shareds: ITerminalShared;
}

export const TerminalNetworkMemoryDefault: TerminalNetworkMemory = {
    request: [],
    shareds: {},
}

export class TerminalNetwork implements ITerminalNetwork {
    allTerminals: StructureTerminal[];
    readyTerminals: StructureTerminal[];
    terminals: StructureTerminal[];

    requests: ITerminalRequest[];
    shareds: ITerminalShared;

    memory: TerminalNetworkMemory;

    private TIMEOUT = 1000;

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
        this.shareds = this.memory.shareds;

        _.remove(this.memory.request, f => {
            if (f.tick + this.TIMEOUT < Game.time) {
                return true;
            }

            const terminal = Game.rooms[f.room].terminal;
            if (terminal) {
                if (f.input) {
                    return terminal.store[f.resourceType] >= f.state.targetAmount;
                } else {
                    return terminal.store[f.resourceType] <= f.state.targetAmount;
                }
            }
        });
    }

    work(): void {
        
    }

    /**
     * 收尾工作
     */
    finish(): void {
        this.memory.request = this.requests;
        this.memory.shareds = this.shareds;
    }

    /**
     * 声明当前可以分享某一类资源
     * @param room 分享资源的房间
     * @param resourceType 类型
     */
    addResourceShared(room: string, resourceType: ResourceConstant) {
        if (!_.find(this.shareds, f => f.includes(room))) {
            this.shareds[resourceType].push(room);
        }
    }

    /**
     * 某一房间取消物资分享
     * @param room 
     * @param resourceType 
     */
    removeResourceShared(room: string, resourceType: ResourceConstant) {
        _.remove(this.shareds[resourceType], f => f == room);
    }

    /**
     * 向 terminal network 申请资源
     */
    addResourceRequest(terminal: StructureTerminal, resourceType: ResourceConstant, amount: number,
                       buy: boolean = true) {
        // 
    }
    
    /**
     * 撤销资源的申请
     */
    removeResourceRequest(terminal: StructureTerminal, resourceType: ResourceConstant) {

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