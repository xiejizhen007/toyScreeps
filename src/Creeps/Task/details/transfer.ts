import { TaskType } from "Creeps/setting";
import { Task } from "../Task";

export class TaskTransfer extends Task {
    target: transferTargetType;
    // data: {
    //     resourceType: ResourceConstant;
    //     amount: number | undefined;
    // }

    constructor(target: transferTargetType, resourceType: ResourceConstant = RESOURCE_ENERGY,
                amount?: number) {
        super(TaskType.transfer, target);
        this.data.resourceType = resourceType;
        this.data.amount = amount;
    }

    isValidTask(): boolean {
        const amount = this.data.amount || 1;
        const carry = this.creep.store[this.data.resourceType];
        return carry >= amount;
    }

    isValidTarget(): boolean {
        const amount = this.data.amount || 1;

        return true;
    }

    work(): ScreepsReturnCode {
        return this.creep.transfer(this.target, this.data.resourceType, this.data.amount);
    }
}