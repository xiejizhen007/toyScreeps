import { TaskType } from "Creeps/setting";
import { TaskBuild } from "./details/build";
import { TaskHarvest } from "./details/harvest";
import { TaskInvalid } from "./details/invalid";
import { TaskPickup } from "./details/pickup";
import { TaskTransfer } from "./details/transfer";
import { TaskWithdraw } from "./details/withdraw";
import { Task } from "./Task";


export function initTask(memory: TaskMemory): Task {
    if (!memory) {
        return null;
    }

    const taskName = memory.name;
    const target = Game.getObjectById(memory._target.id);
    let task: Task;

    switch (taskName) {
        
        case TaskType.build:
            task = new TaskBuild(target as buildTargetType);
            break;

        case TaskType.harvest:
            task = new TaskHarvest(target as harvestTargetType);
            break;

        case TaskType.pickup:
            task = new TaskPickup(target as pickupTargetType);
            break;

        case TaskType.transfer:
            task = new TaskTransfer(target as transferTargetType, memory.data.resourceType, memory.data.amount);
            break;

        case TaskType.withdraw:
            task = new TaskWithdraw(target as withdrawTargetType, memory.data.resourceType, memory.data.amount);
            break;

        default:
            console.log('err task');
            task = new TaskInvalid();
            break;
    }

    if (taskName == TaskType.pickup) {
        console.log(memory.name + ' initTask _parent: ' + memory._parent);
    }

    task.memory = memory;
    return task;
}