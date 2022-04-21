import { Mem } from "Mem";
import { RoomNetwork } from "./RoomNetwork";

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

    inputs: ITerminalInput[];
    outputs: ITerminalOutput[];
    rtr: ITerminalRoomToRoom[];
}

// 资源需求表
export interface ITerminalInput {
    room: string;
    resourceType: ResourceConstant;
    amount: number;
}

// 资源分享表
export interface ITerminalOutput {
    room: string;
    resourceType: ResourceConstant;
    amount?: number;
}

// 定向房间资源表
export interface ITerminalRoomToRoom {
    origin: string;
    target: string;
    resourceType: ResourceConstant;
    amount: number;
}

export const TerminalNetworkMemoryDefault: TerminalNetworkMemory = {
    request: [],
    shareds: {},

    inputs: [],
    outputs: [],
    rtr: [],
}

export function roomOf(terminal: StructureTerminal): RoomNetwork {
    return Kernel.roomNetworks[terminal.room.name];
}

export function isBaseMineral(resourceType: ResourceConstant) {
    return resourceType == 'X' || resourceType == 'O' ||
           resourceType == 'H' || resourceType == 'L' ||
           resourceType == 'K' || resourceType == 'Z' ||
           resourceType == 'U';
}

export class TerminalNetwork implements ITerminalNetwork {
    allTerminals: StructureTerminal[];
    readyTerminals: StructureTerminal[];
    terminals: StructureTerminal[];

    requests: ITerminalRequest[];
    shareds: ITerminalShared;

    memory: TerminalNetworkMemory;

    readyToSend: StructureTerminal[];
    readyToReceived: StructureTerminal[];

    inputRequests: ITerminalInput[];            // 资源请求
    outputRequests: ITerminalOutput[];          // 资源分享
    rtrRequests: ITerminalRoomToRoom[];         // 房到房分享

    private TIMEOUT = 1000;

    static setting = {
        // 平衡房间物资
        equalize: {
            resources: [
                'energy',
                'power',
                'O',
                'H',
                'K',
                'L',
                'Z',
                'U',
                'X',
            ] as ResourceConstant[],
            maxEnergySendSize: 25000,
            maxMineralSendSize: 5000,
        },
    };


    constructor(terminals: StructureTerminal[]) {
        this.allTerminals = _.clone(terminals);
        this.terminals = _.clone(terminals);
        this.readyTerminals = _.filter(terminals, t => t.cooldown == 0);

        this.readyToSend = [];
        this.readyToReceived = [];

        // 注册 memory 并向全局注册本身
        const memory = Mem.wrap(Memory, 'terminalNetwork', TerminalNetworkMemoryDefault) as TerminalNetworkMemory;
        this.memory = memory;
        this.inputRequests = memory.inputs;
        this.outputRequests = memory.outputs;
        this.rtrRequests = memory.rtr;
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
    requestResource(receiver: StructureTerminal, resourceType: ResourceConstant, amount: number,
                    buy: boolean = true) {
        amount = Math.max(amount, TERMINAL_MIN_SEND);
        // 在无冷却的终端中找到合适的发送者
        const possibleSenders = _.filter(this.readyTerminals, 
                                         terminal => terminal.store[resourceType] > amount &&
                                                     this.readyToSend.includes(terminal) &&
                                                     terminal.id != receiver.id);
        // 从合适的发送者中找资源最多的
        const sender = _.max(possibleSenders, t => t.store[resourceType]);
        if (sender) {
            const msg = sender.room.name + " transfer " + resourceType + " to " + receiver.room.name;
            this.transfer(sender, receiver, resourceType, amount, msg);
        } else {
            // 也许要记录这个资源请求
            if (!_.find(this.inputRequests, f => f.room == receiver.room.name && f.resourceType == resourceType)) {
                this.inputRequests.push({
                    room: receiver.room.name,
                    resourceType: resourceType,
                    amount: amount
                });
            }
        }
    }

    // 平衡资源
    private equalize(resourceType: ResourceConstant, terminals = this.terminals) {
        const maxSendSize = resourceType == 'energy' ? TerminalNetwork.setting.equalize.maxEnergySendSize :
                                                       TerminalNetwork.setting.equalize.maxMineralSendSize;
        const terminalsByResource = _.sortBy(terminals, t => t.store[resourceType] || 0);
        
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


    private transfer(sender: StructureTerminal, receiver: StructureTerminal, resourceType: ResourceConstant,
                     amount: number, description?: string) {
        // 能量花费
        const cost = Game.market.calcTransactionCost(amount, sender.room.name, receiver.room.name);
        const ret = sender.send(resourceType, amount, receiver.room.name, description);
        if (ret == OK) {
            this.readyToSend.push(sender);
            this.readyToReceived.push(receiver);
            _.remove(this.readyTerminals, t => t.id == sender.id);
        }

        return ret;
    }
}