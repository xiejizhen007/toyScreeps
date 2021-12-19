export abstract class Task {
    name: string;               // 任务类型名，如 'upgrade'
    creepData: {                   // 执行任任务 Creep 的属性
        name: string,               // 执行任务的 Creep 的名字
    };

    targetData: {                  // 任务目标的属性
        id: string,                 // 目标 id
        pos: RoomPosition,          // 目标地址，
    };

    tick: number;               // 任务发布的时间

    constructor(taskName: string, target: taskTargetType, options = {} as taskOptions) {

    }

    get creep(): Creep {
        return Game.creeps[this.creepData.name];
    }

    set creep(creep: Creep) {
        this.creepData.name = creep.name;
    }

    get taskTarget(): RoomObject | null {
        return Game.getObjectById(this.targetData.id as Id<RoomObject>);
    }
}