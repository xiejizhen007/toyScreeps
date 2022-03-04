/**
 * creep 执行的任务
 */
export abstract class Task {
    type: string;               // task name
    _creep: string;             // creep name
    _target: {
        _id: Id<AnyCreep | Structure>;      // target id
        _pos: PosMemory;                    // target pos memory
    };

    _parent: TaskMemory | null;

    tick: number;
    settings: TaskSettings;
    options: TaskOptions;
    data: TaskData;
    
    constructor(type: string, target: AnyCreep | Structure, options = {} as TaskOptions) {
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
    set creep(creep: Creep) {
        this._creep = creep.name;
    }

    get creep(): Creep {
        return Game.creeps[this._creep];
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
            // this.creep
        }
    }

    // get parent(): Task | null {

    // }

    // get taskQueue(): Task[] {
    //     const taskQueue: Task[] = [this];
    //     let parent = this._parent;
    // }
}