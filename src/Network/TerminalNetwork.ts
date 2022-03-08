import { Global } from "Global/Global";
import { Mem } from "Mem";

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
        tick: number;           // 拒绝超时
        // in: boolean;            // 获取 true，发送 false
        buy: boolean;           // 是否允许购买
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

    init(): void {
        
    }

    work(): void {

    }
}