import { Role } from "Creeps/Role";
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
        creep: string;      // creep name
        task: (CarryTaskMemory | WorkTaskMemory);
    }[];
}

export const TaskListsMemoryDefaults: TaskListsMemory = {
    lists: [],
    doings: [],
}

export class TaskLists {
    memory: TaskListsMemory;
    roomNetwork: RoomNetwork;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.memory = Mem.wrap(roomNetwork.memory, 'taskLists', TaskListsMemoryDefaults);
    }

    refresh(): void {
        if (Game.time % 10 == 0) {
            _.remove(this.memory.doings, f => !Game.creeps[f.creep]);
        }
    }

    // 必须指定 source 和 target
    requestCarry(task: CarryTaskRequest, priority: number = Priority.Normal) {
        if (!this.includeCarryTask(task)) {
            const carryTask: CarryTaskMemory = {
                type: 'transfer',
                source: task.source,
                target: task.target,
                tick: Game.time,
                priority: priority,
                resourceType: task.resourceType,
                amount: task.amount,
            };
            
            this.memory.lists.push(carryTask);
            return true;
        }

        return false;
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

    findAGoodCarryJob(creep: Role) {
        creep.memory.transferTask = null;
        creep.memory.task = null;

        if (this.memory.lists.length > 0) {
            const task = this.memory.lists.find(f => f.type == 'transfer') as CarryTaskMemory;
            if (task) {
                creep.memory.transferTask = task;
                this.memory.doings.push({
                    creep: creep.name,
                    task: task,
                });

                _.remove(this.memory.lists, (f: CarryTaskMemory) => f.source == task.source && f.target == task.target);
                return true;
            }
        }

        creep.memory.transferTask = null;
        creep.memory.task = null;
        return false;
    }

    removeDoingJob(creep: Role) {
        creep.memory.transferTask = null;
        creep.memory.task = null;
        _.remove(this.memory.doings, f => f.creep == creep.name);
    }

    requestWork(task: WorkTaskRequest) {

    }
}