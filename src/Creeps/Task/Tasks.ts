import { TaskType } from "Creeps/setting";
import { TaskHarvest } from "./details/harvest";
import { Task } from "./Task";

export class Tasks {
    static harvest(target: harvestTargetType): TaskHarvest | undefined {
        return new TaskHarvest(target);
    }
}

export function initTask(memory: TaskMemory): Task {
    const taskName = memory.name;
    const target = Game.getObjectById(memory._target.id);
    let task: Task;

    switch (taskName) {
        case TaskType.harvest:
            task = new TaskHarvest(target as harvestTargetType);
            break;
        default:
            break;
    }

    task.memory = memory;
    return task;
}