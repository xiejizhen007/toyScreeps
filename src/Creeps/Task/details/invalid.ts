import { TaskType } from "Creeps/setting";
import { Task } from "../Task";

const invalidTarget = {
    id: '',
    pos: new RoomPosition(25, 25, 'W15N59'),
};

export class TaskInvalid extends Task {
    target: any;

    constructor() {
        super(TaskType.invalid, invalidTarget);
    }

    isValidTask(): boolean {
        return false;        
    }

    isValidTarget(): boolean {
        return false;        
    }

    work(): ScreepsReturnCode {
        return ERR_INVALID_TARGET;
    }
}