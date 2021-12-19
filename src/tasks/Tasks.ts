import { Task } from "./Task";
import { TaskAttack } from "./type/TaskAttack";

export class Tasks extends Task {
    static attack(target: taskAttackTarget, options = {} as taskOptions): TaskAttack {
        return new TaskAttack(target, options);
    }
}