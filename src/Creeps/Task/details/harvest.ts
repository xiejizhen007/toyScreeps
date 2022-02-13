import { TaskType } from "Creeps/setting";
import { Task } from "../Task";

export class TaskHarvest extends Task {
    target: harvestTargetType;

    constructor(target: harvestTargetType) {
        super(TaskType.harvest, target);
    }

    isValidTask(): boolean {
        // return this.creep.store.getFreeCapacity() > 0;
        return true;
    }

    isValidTarget(): boolean {
        if (this.target instanceof Source) {
            return this.target.energy > 0;   
        } else if (this.target instanceof Mineral) {
            return this.target.mineralAmount > 0;
        } else {
            return this.target.cooldown == 0;
        }
    }

    work(): ScreepsReturnCode {
        return this.creep.creep.harvest(this.target);
    }
}