import { Global } from "Global/Global";
import { Mem } from "Mem";
import { Priority } from "setting";

// global use
export interface TerminalNetworkMemory {
    queue: {
            origin: string;
            target: string;
            resourceType: ResourceConstant;
            amount: number;
    }[];

    request: {
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
    }[];
}

export const TerminalNetworkMemoryDefault: TerminalNetworkMemory = {
    queue: [],
    request: [],
}

export class TerminalNetwork {
    allTerminals: StructureTerminal[];
    terminals: StructureTerminal[];
    memory: TerminalNetworkMemory;

    constructor(terminals: StructureTerminal[]) {
        this.allTerminals = _.clone(terminals);
        this.terminals = _.clone(terminals);

        // 注册 memory 并向全局注册本身
        this.memory = Mem.wrap(Memory.global, 'terminalNetwork', TerminalNetworkMemoryDefault);
        Global.terminalNetwork = this;
    }

    /**
     * 清除请求
     */
    init(): void {
        this.memory.request = _.filter(this.memory.request, f => {
            const terminal = Game.rooms[f.room].terminal;
            if (terminal) {
                if (f.input) {
                    return terminal.store[f.resourceType] > f.state.targetAmount;
                } else {
                    return terminal.store[f.resourceType] < f.state.targetAmount;
                }
            }

            return false;
        });
    }

    work(): void {
        
    }

    addResourceShared(room: string, resourceType: ResourceConstant, amount: number) {
        
    }

    addRequest(room: string, resourceType: ResourceConstant, amount: number, input = true, buy = true) {
        const req = _.find(this.memory.request, f => f.room == room && f.resourceType == resourceType);
        if (!req && Game.rooms[room].terminal) {
            this.memory.request.push({
                room: room,
                resourceType: resourceType,
                amount: amount,
                input: input,
                tick: Game.time, 
                buy: buy,
                state: {
                    startAmount: Game.rooms[room].terminal.store[resourceType],
                    targetAmount: Game.rooms[room].terminal.store[resourceType] + amount,
                },
            });
        }
    }

    removeRequest(room: string, resourceType: ResourceConstant) {
        const req = _.find(this.memory.request, f => f.room == room && f.resourceType == resourceType);
    }

    // avgTerminalResource(room: string) {
    //     const roomNetwork = Global.roomNetworks[room];
    //     if (!roomNetwork) {
    //         return;
    //     }

    //     const storage = roomNetwork.storage;
    //     const terminal = roomNetwork.terminal;

    //     if (storage && terminal) {
    //         for (const resource in terminal.store) {
    //             const resourceType = resource as ResourceConstant;
    //             const terminalAmount = terminal.store[resourceType];
    //             const storageAmount = storage.store[resourceType];

    //             if (resourceType == 'energy') {
    //                 if (terminalAmount < 50000 && terminalAmount + storageAmount > 50000) {
    //                     roomNetwork.commandCenter.transportNetwork.requestInput(terminal, Priority.Normal, {
    //                         resourceType: resourceType,
    //                         amount: 50000 - terminalAmount
    //                     });

    //                     break;
    //                 }
    //             } else {
    //                 if (terminalAmount < 3000 && terminalAmount + storageAmount > 3000) {
    //                     roomNetwork.commandCenter.transportNetwork.requestInput(terminal, Priority.Normal, {
    //                         resourceType: resourceType,
    //                         amount: 3000 - terminalAmount
    //                     });

    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // }
}