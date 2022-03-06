import { TaskType } from "Tasks/setting";
import { Task } from "Tasks/Task";

export type TaskTransferType = AnyCreep | Structure;

export class TaskTransfer extends Task {
    target: TaskTransferType;
    data: {
        resourceType: ResourceConstant;
        amount: number | undefined;
    }

    constructor(target: TaskTransferType, resourceType: ResourceConstant, amount?: number, opts = {} as TaskOptions) {
        super(TaskType.transfer, target, opts);
        this.settings.oneShot = true;
        
        this.data.resourceType = resourceType;
        this.data.amount = amount;
    }

    isValidTask(): boolean {
        const trueAmount = this.data.amount || 1;
        return this.creep.store[this.data.resourceType] >= trueAmount;
    }

    isValidTarget(): boolean {
        return true;        
    }

    run(): ScreepsReturnCode {
        return this.creep.transfer(this.target, this.data.resourceType, this.data.amount);        
    }
}