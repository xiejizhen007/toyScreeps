import { TaskType } from "Creeps/setting";
import { Task } from "../Task";

export class TaskUpgrade extends Task {
    target: upgradeTargetType;

    constructor(target: upgradeTargetType) {
        super(TaskType.upgrade, target);

        this.setting.targetRange = 3;
    }

    isValidTask(): boolean {
        return this.creep.store[RESOURCE_ENERGY] > 0;
    }

    isValidTarget(): boolean {
        return this.target && this.target.my;
    }

    work(): ScreepsReturnCode {
        return this.creep.creep.upgradeController(this.target);
    }
}