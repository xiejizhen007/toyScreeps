import { Task } from "Tasks/Task";

export type TaskWithdrawType = Structure;

export class TaskWithdraw extends Task {
    target: TaskWithdrawType;
    data: {
        resourceType: ResourceConstant;
        amount: number | undefined;
    };

    constructor(target: TaskWithdrawType, resourceType: ResourceConstant, amount?: number, opts = {} as TaskOptions) {
        super('withdraw', target, opts);

        this.settings.oneShot = true;
        this.settings.range = 1;
        
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

    // work(): void {
    //     return this.creep.withdraw(this.target, this.data.resourceType, this.data.amount);        
    // }

    run(): ScreepsReturnCode {
        this.target = this.taskTarget as TaskWithdrawType;
        return this.creep.withdraw(this.target, this.data.resourceType, this.data.amount);        
    }
}