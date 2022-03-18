import { Mem } from "Mem";
import { Priority } from "setting";
import { RoomNetwork } from "./RoomNetwork"

export interface CarryTaskRequest {
    source: string;
    target: string;

    resourceType: ResourceConstant | 'all';
    amount?: number;
}

export interface CarryTaskMemory {
    type: string;               // 任务类型：'transfer'

    source: string;
    target: string;

    tick: number;           // 用于设置超时
    priority: number;       // 任务的优先级
    resourceType: ResourceConstant | 'all';
    amount: number;
}

export interface WorkTaskRequest {
    type: string;               // 任务类型：'harvest', 'upgrade', 'repair', 'build'...

    target: string;             // target id
    pos: PosMemory;             // target position
}

export interface WorkTaskMemory {
    type: string;               // 任务类型：'harvest', 'upgrade', 'repair', 'build'...

    target: string;             // target id
    pos: PosMemory;             // target position
    tick: number;               // 用于设置超时
    priority: number;           // 优先级
}

export interface TaskListsMemory {
    lists: (CarryTaskMemory | WorkTaskMemory)[];
    doings: {
        creep: string;
        task: (CarryTaskMemory | WorkTaskMemory);
    }[];
}

export const TaskListsMemoryDefaults: TaskListsMemory = {
    lists: [],
    doings: [],
}

export class TaskLists {
    roomNetwork: RoomNetwork;
    memory: TaskListsMemory;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.memory = Mem.wrap(roomNetwork.memory, 'taskLists', TaskListsMemoryDefaults);
    }

    // 必须指定 source 和 target
    requestCarry(task: CarryTaskRequest) {
        if (!this.includeCarryTask(task)) {
            
        }
    }

    private includeCarryTask(task: CarryTaskRequest) {
        // 在 lists 和 doings 的任务中查找是否存在当前任务
        const task_ = _.find(this.memory.lists, (f: CarryTaskMemory) => f.type == 'transfer' 
            && f.source == task.source && f.target == task.target 
            && f.resourceType == task.resourceType) || _.find(this.memory.doings, (f: CarryTaskMemory) => f.type == 'transfer'
            && f.source == task.source && f.target == task.target
            && f.resourceType == task.resourceType);

        return task_ ? true : false;
    }

    requestWork(task: WorkTaskRequest) {

    }
}