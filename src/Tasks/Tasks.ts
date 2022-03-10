import { TaskType } from "./setting";
import { TaskHarvest, TaskHarvestType } from "./Type/harvest";
import { TaskTransfer, TaskTransferType } from "./Type/transfer";
import { TaskWithdraw, TaskWithdrawType } from "./Type/withdraw";

export class Tasks {
    static harvest(target: TaskHarvestType) {
        return new TaskHarvest(target);
    }

    static transfer(target: TaskTransferType, resourceType: ResourceConstant, amount?: number) {
        return new TaskTransfer(target, resourceType, amount);
    }

    static withdraw(target: TaskWithdrawType, resourceType: ResourceConstant, amount?: number) {
        return new TaskWithdraw(target, resourceType, amount);
    }
}

/**
 * 
 */
export function initializeTask(memory: TaskMemory) {
    if (!memory) { 
        return null;
    }

    const type = memory.type;
    const target = Game.getObjectById(memory._target._id);
    let task: any;

    switch(type) {
        case TaskType.harvest:
            task = new TaskHarvest(target as TaskHarvestType);
            break;
        case TaskType.transfer:
            task = new TaskTransfer(target as TaskTransferType, memory.data.resourceType, memory.data.amount);
            break;

        case TaskType.withdraw:
            task = new TaskWithdraw(target as TaskWithdrawType, memory.data.resourceType, memory.data.amount);
            break;
        
        default:
            task = null;
            break;
    }

    task.memory = memory;
    return task;
}