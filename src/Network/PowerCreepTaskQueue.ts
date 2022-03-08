import { Mem } from "Mem";
import { RoomNetwork } from "./RoomNetwork";

export type PowerCreepTaskType = {
    type: PowerConstant;
    target?: string;
}

export interface PowerCreepTaskQueueMemory {
    queue: PowerCreepTaskType[];
}

const PowerCreepTaskQueueMemoryDefaluts: PowerCreepTaskQueueMemory = {
    queue: []
}

export class PowerCreepTaskQueue {
    memory: PowerCreepTaskQueueMemory;
    roomNetwork: RoomNetwork;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.memory = Mem.wrap(roomNetwork.memory, 'pcTaskQueue', PowerCreepTaskQueueMemoryDefaluts);
    }

    init(): void {

    }

    work(): void {
        
    }

    push(task: PowerCreepTaskType) {
        this.memory.queue.push(task);
    }

    front(): PowerCreepTaskType {
        return this.memory.queue[0];
    }

    pop(): PowerCreepTaskType {
        return this.memory.queue.shift();
    }
}