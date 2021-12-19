import { Task } from "../Task";
import { TASK_NAME } from "setting";

export class TaskAttack extends Task {
    target: taskAttackTarget;

    constructor(target: taskAttackTarget, options = {} as taskOptions) {
        super(TASK_NAME.ATTACK, target, options);
        this.target = this.taskTarget as taskAttackTarget;
    }

    isValidTask() {
        return this.creep.getActiveBodyparts(ATTACK) > 0 || this.creep.getActiveBodyparts(RANGED_ATTACK) > 0;
    }

    isValidTarget() {
        return this.target && this.target.hits > 0;
    }

    work() {
        
    }
}