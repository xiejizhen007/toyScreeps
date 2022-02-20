import { Global } from "Global/Global";
import { RoomNetwork } from "Network/RoomNetwork";
import { TaskType } from "./setting";
import { Task } from "./Task/Task";
import { initTask } from "./Task/tool";

export abstract class Role {
    roomNetwork: RoomNetwork;

    roleName: string;

    creep: Creep;
    pos: RoomPosition;
    nextPos: RoomPosition;
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
    
    private _task: Task | null;

    constructor(creep: Creep, roomNetwork: RoomNetwork) {
        this.creep = creep;
        this.pos = creep.pos;
        this.nextPos = creep.pos;
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

        this.roomNetwork = roomNetwork;
        Global.roles[creep.name] = this;
    }

    set task(task: Task | null) {
        const oldTaskMemory = this.creep.memory.task;
        if (oldTaskMemory) {
            // console.log('have old task memory');
        }

        this.memory.task = task ? task.memory : null;
        if (task) {
            task.creep = this;
        }

        this._task = null;
    }

    get task(): Task | null {
        if (!this._task) {
            this._task = this.memory.task ? initTask(this.memory.task) : null;
        }
        return this._task;
    }

    get isWorking(): boolean {
        return this.creep && !this.creep.spawning && this.creep.memory.working;
    }

    set isWorking(working: boolean) {
        if (this.creep) {
            this.creep.memory.working = working;
        }
    }

    abstract init(): void;
    abstract work(): void;


    attack(target: AnyCreep | Structure) {
        return this.creep.attack(target);
    }

    attackController(target: StructureController) {
        return this.creep.attackController(target);
    }

    build(target: ConstructionSite) {
        return this.creep.build(target);
    }

    cancelOrder(methodName: string) {
        return this.creep.cancelOrder(methodName);
    }

    claimController(target: StructureController) {
        return this.creep.claimController(target);
    }

    dismantle(target: Structure) {
        return this.creep.dismantle(target)
    }

    drop(resourceType: ResourceConstant, amount?: number) {
        return this.creep.drop(resourceType, amount);
    }

    generateSafeMode(target: StructureController) {
        return this.creep.generateSafeMode(target);
    }

    getActiveBodyParts(type: BodyPartConstant) {
        return this.creep.getActiveBodyparts(type);
    }

    harvest(target: Source | Mineral | Deposit) {
        return this.creep.harvest(target);
    }

    heal(target: AnyCreep) {
        return this.creep.heal(target);
    }

    move(direction: DirectionConstant) {
        return this.creep.move(direction);
    }

    notifyWhenAttacked(enable: boolean) {
        return this.creep.notifyWhenAttacked(enable);
    }

    pickup(target: Resource) {
        return this.creep.pickup(target);
    }

    pull(target: Creep) {
        return this.creep.pull(target);
    }

    rangedAttack(target: Creep | PowerCreep | Structure) {
        return this.creep.rangedAttack(target);
    }

    rangedHeal(target: Creep | PowerCreep) {
        return this.creep.rangedHeal(target);
    }

    rangedMassAttack() {
        return this.creep.rangedMassAttack();
    }

    repair(target: Structure) {
        return this.creep.repair(target);
    }

    reserveController(target: StructureController) {
        return this.creep.reserveController(target);
    }

    say(message: string, pub?: boolean) {
        return this.creep.say(message, pub);
    }

    signController(target: StructureController, text: string) {
        return this.creep.signController(target, text);
    }

    suicide() {
        return this.creep.suicide();
    }

    transfer(target: Creep | PowerCreep | Structure, resourceType: ResourceConstant, amount?: number) {
        return this.creep.transfer(target, resourceType, amount);
    }

    upgradeController(target: StructureController) {
        return this.creep.upgradeController(target);
    }

    withdraw(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number) {
        return this.creep.withdraw(target, resourceType, amount);
    }
}