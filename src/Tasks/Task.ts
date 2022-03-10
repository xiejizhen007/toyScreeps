import { Role } from "Creeps/Role";
import { Global } from "Global/Global";
import { initializeTask } from "./Tasks";

/**
 * creep 执行的任务
 */

type TaskTargetType = {
    id: string;
    pos: PosMemory;
}

export abstract class Task {
    type: string;               // task name
    _creep: string;             // creep name
    _target: {
        _id: string;                        // target id
        _pos: PosMemory;                    // target pos memory
    };

    _parent: TaskMemory | null;

    tick: number;
    settings: TaskSettings;
    options: TaskOptions;
    data: TaskData;

    target: RoomObject;
    
    constructor(type: string, target: TaskTargetType, options = {} as TaskOptions) {
        this.type = type;
        this._creep = '';

        if (target) {
            this._target = {
                _id: target.id,
                _pos: target.pos,
            }
        } else {
            this._target = {
                _id: null,
                _pos: {
                    x: -1,
                    y: -1,
                    roomName: ''
                },
            }
        }

        this._parent = null;
        this.settings = {
            range: 3,
            oneShot: false,
            timeout: Infinity,
        };

        this.tick = Game.time;
        this.options = options;
        this.data = {};
    }

    /**
     * 由 creep 执行任务
     */
    set creep(creep: Role) {
        this._creep = creep.name;
    }

    get creep(): Role {
        return Global.roles[this._creep];
    }

    /**
     * 任务持久化
     */
    set memory(memory: TaskMemory) {
        this._creep = memory._creep;
        this._target = memory._target;
        this._parent = memory._parent;
        this.tick = memory.tick;
        this.options = memory.options;
        this.data = memory.data;
    }

    get memory(): TaskMemory {
        return {
            type: this.type,
            _creep: this._creep,
            _target: this._target,
            _parent: this._parent,
            tick: this.tick,
            options: this.options,
            data: this.data,
        };
    }

    set parent(parent: Task | null) {
        this._parent = parent ? parent.memory : null;
        if (this.creep) {
            this.parent.creep = this.creep;
        }
    }

    get parent(): Task | null {
        return this._parent ? initializeTask(this._parent) : null;
    }

    set taskTarget(target: any) {
        if (target && target.id && target.pos) {
            this._target._id = target.id;
            this._target._pos = target.pos;
        }
    }

    get taskTarget(): RoomObject {
        if (this._target) {
            return Game.getObjectById(this._target._id as Id<Creep> | Id<Structure> | Id<Source>);
        }
    }

    // get taskQueue(): Task[] {
    //     const taskQueue: Task[] = [this];
    //     let parent = this._parent;
    // }

    abstract isValidTask(): boolean;
    abstract isValidTarget(): boolean;
    abstract run(): ScreepsReturnCode;

    work() {
        if (this.isValidTask() && this.isValidTarget()) {
            const target = this.taskTarget;
            if (!this.creep.pos.inRangeTo(target, this.settings.range)) {
                this.creep.goto(target);
                return;
            }

            const ret = this.run();
            console.log('task return: ' + ret);
            if (ret == OK && this.settings.oneShot) {
                this.finish();
            }
        }
    }

    fork(newTask: Task) {
        newTask.parent = this;
        if (this.creep) {
            this.creep.task = newTask;
        }
        return newTask;
    }

    finish() {
        if (this.creep) {
            this.creep.task = this.parent;
        }
    }
}