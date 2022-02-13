import { TaskType } from "Creeps/setting";
import { Task } from "../Task";

export class TaskPickup extends Task {
    target: pickupTargetType;

    constructor(target: pickupTargetType) {
        super(TaskType.pickup, target);
        
        this.setting.oneShot = true;
    }

    isValidTask(): boolean {
        return this.creep.store.getFreeCapacity() > 0;
    }

    isValidTarget(): boolean {
        return this.target && this.target.amount > 0;
    }

    work(): ScreepsReturnCode {
        return this.creep.creep.pickup(this.target);
    }
}