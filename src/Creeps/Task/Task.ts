type targetType = {
    id: string;
    pos: RoomPosition;
}

export abstract class Task {
    taskName: string;

    _creep: {
        name: string;
    };

    _target: {
        id: string;
        pos: RoomPosition;
    }

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
                pos: new RoomPosition(-1, -1, ''),
            }
        }

        this.tick = Game.time;

        this.setting = {
            targetRange: 1,
            timeout: Infinity,
        };

        this.data = {};
    }

    set creep(creep: Creep) {
        this._creep.name = creep.name;
    }

    get creep(): Creep {
        return Game.creeps[this._creep.name];
    }

    set memory(memory: TaskMemory) {
        this._creep = memory._creep;
        this._target = memory._target;
        this.tick = memory.tick;
        this.data = memory.data;
    }

    get memory(): TaskMemory {
        return {
            name: this.taskName,
            _creep: this._creep,
            _target: this._target,
            tick: this.tick,
            data: this.data,
        };
    }

    abstract isValidTask(): boolean;

    abstract isValidTarget(): boolean;

    abstract work(): ScreepsReturnCode;

    autoWork(): ScreepsReturnCode {
        if (this.target && this.creep) {
            if (this.creep.pos.inRangeTo(this.target, this.setting.targetRange)) {
                const ret = this.work();

                return ret;
            } else {
                this.creep.goto(this.target.pos);
                return ERR_NOT_IN_RANGE;
            }
        }
    }

    finish(): void {

    }
}