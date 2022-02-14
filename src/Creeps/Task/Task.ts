import { Role } from "Creeps/Role";
import { TaskType } from "Creeps/setting";
import { Global } from "Global/Global";
import { initTask } from "./tool";

type targetType = {
    id: string;
    pos: PosMemory;
}


// TODO: 在某一 tick 中设置了 parent task，在下一个 tick，parent task 消失
export abstract class Task {
    taskName: string;

    _creep: {
        name: string;
    };

    _target: {
        id: string;
        pos: PosMemory;
    }

    _parent: TaskMemory | null;

    tick: number;
    setting: TaskSetting;
    data: TaskData;
    target: RoomObject;

    constructor(taskName: string, target: targetType) {
        this.taskName = taskName;
        
        this._creep = {
            name: '',
        };
    
        if (target) {
            this._target = {
                id: target.id,
                pos: target.pos,
            };

            this.target = Game.getObjectById(target.id) || Game.flags[target.id] || Game.creeps[target.id] || null;
        } else {
            this._target = {
                id: '',
                pos: {
                    x: -1,
                    y: -1,
                    roomName: '',
                }
            }
        }

        this._parent = null;

        this.tick = Game.time;

        this.setting = {
            targetRange: 1,
            timeout: Infinity,
            oneShot: false,
        };

        this.data = {};
    }

    set creep(creep: Role) {
        this._creep.name = creep.name;
        if (this._parent) {
            this.parent!.creep = creep;
        }
    }

    get creep(): Role {
        return Global.roles[this._creep.name];
    }

    set memory(memory: TaskMemory) {
        this.taskName = memory.name;
        this._creep = memory._creep;
        this._target = memory._target;
        this._parent = memory._parent;
        this.tick = memory.tick;
        this.data = memory.data;
    }

    get memory(): TaskMemory {
        return {
            name: this.taskName,
            _creep: this._creep,
            _target: this._target,
            _parent: this._parent,
            tick: this.tick,
            data: this.data,
        };
    }

    set parent(parentTask: Task | null) {
        this._parent = parentTask ? parentTask.memory : null;

        if (this.creep) {
            this.creep.task = this;
        }
    }

    get parent(): Task | null {
        return this._parent ? initTask(this._parent) : null;
    }

    fork(newTask: Task): Task {
        newTask.parent = this;
        if (this.creep) {
            if (newTask.parent) {
                console.log('newTask ' + newTask.taskName + ' parent is ' + this.taskName);
            }
            this.creep.task = newTask;
        }
        return newTask;
    }

    abstract isValidTask(): boolean;

    abstract isValidTarget(): boolean;

    abstract work(): ScreepsReturnCode;

    autoWork(): ScreepsReturnCode {
        if (this.isValid()) {
            if (this.creep.pos.inRangeTo(this.target, this.setting.targetRange)) {
                const ret = this.work();

                if (ret == OK && this.setting.oneShot) {
                    this.finish();
                }

                return ret;
            } else {
                this.creep.creep.goto(this.target.pos);
                return ERR_NOT_IN_RANGE;
            }
        } else {
            return ERR_INVALID_TARGET;
        }
    }

    isValid(): boolean {
        let validTask = false;
        if (this.creep) {
            validTask = this.isValidTask();
        }

        let validTarget = false;
        if (this.target) {
            validTarget = this.isValidTarget();
        }

        if (validTask && validTarget) {
            return true;
        }

        return false;
    }

    finish(): void {
        if (this.creep) {
            this.creep.task = this.parent;
        }
    }
}