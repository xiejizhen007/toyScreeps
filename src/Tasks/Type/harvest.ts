import { TaskType } from "Tasks/setting";
import { Task } from "Tasks/Task";

export type TaskHarvestType = Source | Mineral | Deposit;

export class TaskHarvest extends Task {
    target: Source | Mineral | Deposit;

    constructor(target: Source | Mineral | Deposit) {
        super(TaskType.harvest, target);
        this.target = target;
    }
    
    isValidTask(): boolean {
        return this.creep.store.getFreeCapacity() > 0;
    }

    isValidTarget(): boolean {
        if (this.target instanceof Source) {
            return this.target.energy > 0;
        } else if (this.target instanceof Mineral) {
            return this.target.mineralAmount > 0;
        } else if (this.target instanceof Deposit) {
            return this.target.cooldown == 0;
        }

        return false;
    }

    run(): ScreepsReturnCode {
        return this.creep.harvest(this.target);
    }
}