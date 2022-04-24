// 任务的抽象类

import { Role } from "creeps/Role";

export abstract class Task {
    name: string;           // 任务名

    _creep: string;         // 执行该任务的 creep name
    _target: TaskTarget;    // 任务的目标
    
    tick: number;           // 设置该任务时的 tick
    data: TaskData;
    setting: TaskSetting;

    constructor(name: string, target: IdObject, opts = {}) {
        this.name = name;
    
        if (target) {
            this._target.id = target.id;
            this._target.pos = target.pos;
        }
    }

    get target(): IdObject | null {
        return Game.getObjectById(this._target.id) || null;
    }

    get memory(): TaskMemory {
       return {
           name: this.name,
           creep: this._creep,
           target: this._target,
           tick: this.tick,
           data: this.data,
           setting: this.setting,
       };
    }

    set memory(m: TaskMemory) {
        this.name = m.name;
        this._creep = m.creep;
        this._target = m.target;
        this.tick = m.tick;
        this.data = m.data;
        this.setting = m.setting;
    }

    get creep(): Role {
        return null;
    }

    set creep(c: Role) {
        this._creep = c.name;
    }
}