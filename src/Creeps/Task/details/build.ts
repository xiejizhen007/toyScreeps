import { TaskType } from "Creeps/setting";
import { Task } from "../Task";

export class TaskBuild extends Task {
    target: buildTargetType;

    constructor(target: buildTargetType) {
        super(TaskType.build, target);

        this.setting.targetRange = 3;
    }

    isValidTask(): boolean {
        return this.creep.store[RESOURCE_ENERGY] > 0;
    }

    isValidTarget(): boolean {
        return this.target && this.target.my && this.target.progress < this.target.progressTotal;
    }

    work(): ScreepsReturnCode {
        return this.creep.creep.build(this.target);
    }
}