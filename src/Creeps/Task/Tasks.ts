import { TaskType } from "Creeps/setting";
import { TaskBuild } from "./details/build";
import { TaskHarvest } from "./details/harvest";
import { TaskInvalid } from "./details/invalid";
import { TaskPickup } from "./details/pickup";
import { TaskTransfer } from "./details/transfer";
import { TaskWithdraw } from "./details/withdraw";
import { Task } from "./Task";

export class Tasks {

    static build(target: buildTargetType): TaskBuild | undefined {
        return new TaskBuild(target);
    }

    static harvest(target: harvestTargetType): TaskHarvest | undefined {
        return new TaskHarvest(target);
    }

    static pickup(target: pickupTargetType): TaskPickup | undefined {
        return new TaskPickup(target);
    }

    static transfer(target: transferTargetType, resourceType: ResourceConstant,
                    amount?: number): TaskTransfer | undefined {
        return new TaskTransfer(target, resourceType, amount);
    }

    static withdraw(target: withdrawTargetType, resourceType: ResourceConstant,
                    amount?: number): TaskWithdraw | undefined {
        return new TaskWithdraw(target, resourceType, amount);
    }

}

// export function initTask(memory: TaskMemory): Task {
//     const taskName = memory.name;
//     const target = Game.getObjectById(memory._target.id);
//     let task: Task;

//     switch (taskName) {
        
//         case TaskType.build:
//             task = new TaskBuild(target as buildTargetType);

//         case TaskType.harvest:
//             task = new TaskHarvest(target as harvestTargetType);
//             break;

//         case TaskType.transfer:
//             task = new TaskTransfer(target as transferTargetType, memory.data.resourceType, memory.data.amount);
//             break;

//         case TaskType.withdraw:
//             task = new TaskWithdraw(target as withdrawTargetType, memory.data.resourceType, memory.data.amount);
//             break;

//         default:
//             console.log('err task');
//             task = new TaskInvalid();
//             break;
//     }

//     task.memory = memory;
//     return task;
// }