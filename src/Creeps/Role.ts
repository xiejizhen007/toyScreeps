import { RoomNetwork } from "Network/RoomNetwork";
import { TaskType } from "./setting";
import { Task } from "./Task/Task";
import { initTask } from "./Task/Tasks";

export abstract class Role {
    creep: Creep;
    roomNetwork: RoomNetwork;

    _task: Task | null;

    constructor(name: string, roomNetwork: RoomNetwork) {
        this.creep = Game.creeps[name];
        this.roomNetwork = roomNetwork;
    }

    set task(task: Task | null) {
        const oldTaskMemory = this.creep.memory.task;
        if (oldTaskMemory) {
            console.log('have old task memory');
        }

        this.creep.memory.task = task ? task.memory : null;
        if (task) {
            task.creep = this.creep;
        }
    }

    get task(): Task | null {
        if (!this._task) {
            this._task = this.creep.memory.task ? initTask(this.creep.memory.task) : null;
        }
        return this._task;
    }

    // handleTask(): void {
    //     switch (this.creep.memory.task.type) {
    //         case TaskType.harvest:
    //             this.taskHarvest();
    //             break;
        
    //         case TaskType.withdraw:
    //             this.taskWithdraw();
    //             break;

    //         default:
    //             break;
    //     }
    // }

    // private taskHarvest(): void {
    //     const obj = Game.getObjectById(this.creep.memory.task.target as Id<Source> | Id<Mineral> | Id<Deposit>);
    //     if (obj) {
    //         if (this.creep.pos.isNearTo(obj)) {
    //             let harvest = false;
    //             if (obj instanceof Source) {
    //                 harvest = obj.energy > 0;
    //             } else if (obj instanceof Mineral) {
    //                 harvest = obj.mineralAmount > 0;
    //             } else if (obj instanceof Deposit) {
    //                 harvest = obj.cooldown == 0;
    //             }

    //             if (harvest) {
    //                 this.creep.harvest(obj);
    //             }
    //         } else {
    //             this.creep.goto(obj.pos);
    //         }
    //     }
    // }

    // private taskWithdraw(): void {
    //     const target = Game.getObjectById(this.creep.memory.task.target as Id<Structure> | Id<Tombstone> | Id<Ruin>);
    //     if (target) {
    //         // const amount = Math.min(target.)
    //         // const resourceType = this.creep.memory.task.resourceType ? this.creep.memory.task.resourceType : RESOURCE_ENERGY;
    //         const resourceType = this.creep.memory.task.resourceType;
    //         let amount = this.creep.memory.task.amount ? this.creep.memory.task.amount : 1;
    //         if (this.creep.pos.isNearTo(target)) {
    //             if (target instanceof Structure) {
    //                 if (target instanceof StructureStorage || target instanceof StructureTerminal
    //                     || target instanceof StructureContainer || target instanceof StructureFactory) {
    //                     amount = Math.min(this.creep.store.getFreeCapacity(), target.store[resourceType], amount);
    //                 }
    //             } else if (target instanceof Tombstone) {
    //                 amount = Math.min(this.creep.store.getFreeCapacity(), target.store[resourceType], amount);
    //             } else if (target instanceof Ruin) {
    //                 amount = Math.min(this.creep.store.getFreeCapacity(), target.store[resourceType], amount);
    //             }

    //             if (amount) {
    //                 this.creep.withdraw(target, resourceType, amount);
    //             }
    //         } else {
    //             this.creep.goto(target.pos);
    //         }
    //     } else {
    //         console.log('creep task err ' + this.creep.id + '');
    //     }
    // }

    abstract init(): void;
    abstract work(): void;
}