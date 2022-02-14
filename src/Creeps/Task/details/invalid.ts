import { TaskType } from "Creeps/setting";
import { Task } from "../Task";

const invalidTarget = {
    id: '',
    pos: {
        x: -1,
        y: -1,
        roomName: '',
    } as PosMemory
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