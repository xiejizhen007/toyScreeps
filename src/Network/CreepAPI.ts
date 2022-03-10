import { Role } from "Creeps/Role";
import { Mem } from "Mem";
import { RoomNetwork } from "./RoomNetwork";

export interface CreepTasksType {
    type: string;       // 任务类型
    target: string;     // 目标 id
    pos: PosMemory;     // 目标位置
    tick: number;       // 发布任务时的 tick

    creep?: Id<Creep>;  // 正在处理该任务的 creep
    data?: {
        resourceType: ResourceConstant;
        amount: number;
    }
}

export interface CreepTasksMemory {
    taskLists: CreepTasksType[];
}

export const CreepTasksMemoryDefaults: CreepTasksMemory = {
    taskLists: []
}

/**
 * 基于房间分发任务
 */
export class CreepTasks {
    memory: CreepTasksMemory;
    roomNetwork: RoomNetwork;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.memory = Mem.wrap(roomNetwork.memory, 'creepTasks', CreepTasksMemoryDefaults);
    }

    add(task: CreepTasksType) {
        this.memory.taskLists.push(task);
    }

    rm(task: CreepTasksType) {
        this.memory.taskLists = _.filter(this.memory.taskLists, f => f.target != task.target);
    }

    set(creep: Role) {
        
    }
}