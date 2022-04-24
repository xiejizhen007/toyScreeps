interface TaskTarget {
    id: Id<IdObject>;       // 任务目标的 id
    pos: RoomPosition;      // 任务目标的位置，处理无视野的情况
}

interface TaskMemory {
    name: string;           // 任务名
    tick: number;           // 任务下发时的时间
    data: TaskData;
    setting: TaskSetting;

    creep: string;          // 执行该任务 creep 的名字
    target: TaskTarget;     // 任务对象
}

interface TaskData {
    resourceType?: ResourceConstant;
    amount?: number;
}

interface TaskSetting {
    once?: boolean;         // 仅执行一次
    range?: number;         // 距离目标多远
    timeout?: number;       // 经过多久该任务超时
}