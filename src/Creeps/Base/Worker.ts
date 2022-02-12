import { Role } from "Creeps/Role";
import { TaskType } from "Creeps/setting";

export class Worker extends Role {
    // TODO: get task
    init(): void {
        // if (!this.creep.memory.task) {
        //     this.creep.memory.task = {
        //         type: TaskType.err
        //     };
        // }

        // this.getTask();

        // if (this.creep.store[RESOURCE_ENERGY] == 0) {
        //     this.creep.memory.working = false;
        // } else if (this.creep.store.getFreeCapacity() == 0) {
        //     this.creep.memory.working = true;
        // }
    }

    // TODO: do something
    work(): void {
        // if (this.creep.memory.working) {
        //     if (this.creep.memory.task.type == TaskType.build) {
        //         const target = Game.constructionSites[this.creep.memory.task.target];
        //         if (target) {
        //             if (this.creep.pos.inRangeTo(target, 3)) {
        //                 this.creep.build(target);
        //             } else {
        //                 this.creep.goto(target.pos);
        //             }
        //         } else {
        //             this.creep.memory.task.type = TaskType.err;
        //         }
        //     }
        // } else {
        //     this.getEnergy();
        // }
    }

    // private getTask(): void {
    //     // console.log(this.creep.room.construcutionSites);
    //     if (this.roomNetwork.room.constructionSites.length && this.creep.memory.task.type == TaskType.err) {
    //         const target = this.creep.pos.findClosestByRange(this.roomNetwork.room.constructionSites);
    //         // this.creep.
    //         // this.creep.memory.task.target = target.id;
    //         this.creep.memory.task = {
    //             type: TaskType.build,
    //             target: target.id,
    //             targetPos: target.pos,
    //         };

    //         return;
    //     }
    // }

    // private getEnergy(): ScreepsReturnCode {
    //     let energy: Structure | Resource;
    //     if (this.creep.room.storage && this.creep.room.storage.store[RESOURCE_ENERGY] > 0) {
    //         energy = this.creep.room.storage;
    //     } else if (this.creep.room.terminal && this.creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
    //         energy = this.creep.room.terminal;
    //     } else if (this.creep.room.find(FIND_DROPPED_RESOURCES).length) {
    //         energy = this.creep.pos.findClosestByRange(this.creep.room.find(FIND_DROPPED_RESOURCES, {
    //             filter: d => d.resourceType == RESOURCE_ENERGY
    //         }));
    //     }

    //     if (energy) {
    //         // console.log('energy: ' + energy);
    //         if (energy instanceof Structure) {
    //             return this.creep.withdrawFrom(energy, RESOURCE_ENERGY);
    //         } else {
    //             if (this.creep.pos.isNearTo(energy)) {
    //                 return this.creep.pickup(energy);
    //             } else {
    //                 this.creep.goto(energy.pos);
    //                 return ERR_NOT_IN_RANGE;
    //             }
    //         }
    //     } else {
    //         console.log('room ' + this.creep.room.name + ' no energy');
    //         return ERR_NOT_ENOUGH_ENERGY;
    //     }
    // }
}