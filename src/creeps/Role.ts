// 处理房间事务的基本单位

export class Role {
    creep: Creep;

    // creep 原先的属性
    pos: RoomPosition;
    room: Room;
    body: BodyPartDefinition[];
    fatigue: number;
    hits: number;
    hitsMax: number;
    id: Id<Creep>;
    memory: CreepMemory;
    name: string;
    saying: string;
    spawning: boolean;
    store: StoreDefinition;
    ticksToLive: number;
    // 扩展属性
    role: string;       // 角色名
    block: boolean;     // 是否运行通行

    constructor(creep: Creep) {
        this.creep = creep;
        // 原来的属性
        this.pos = creep.pos;
        this.room = creep.room;
        this.body = creep.body;
        this.fatigue = creep.fatigue;
        this.hits = creep.hits;
        this.hitsMax = creep.hitsMax;
        this.id = creep.id;
        this.memory = creep.memory;
        this.name = creep.name;
        this.saying = creep.saying;
        this.spawning = creep.spawning;
        this.store = creep.store;
        this.ticksToLive = creep.ticksToLive;
        // 扩展的属性
        this.role = creep.memory.role;
        this.block = creep.memory.block;
        // 向 kernel 注册
        Kernel.roles[this.name] = this;
    }
}