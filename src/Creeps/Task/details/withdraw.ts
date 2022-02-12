import { TaskType } from "Creeps/setting";
import { Task } from "../Task";

export class taskWithdraw extends Task {
    target: withdrawTargetType;

    constructor(target: withdrawTargetType, resourceType: ResourceConstant,
                amount?: number) {
        super(TaskType.withdraw, target);

        this.data.resourceType = resourceType;
        this.data.amount = amount;
    }

    isValidTask(): boolean {
        const amount = this.data.amount || 1;
        return this.creep.store.getFreeCapacity() >= amount;
    }

    isValidTarget(): boolean {
        return true;
    }

    work(): ScreepsReturnCode {
        return this.creep.withdraw(this.target, this.data.resourceType, this.data.amount);        
    }
}