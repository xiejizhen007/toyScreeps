// 只会在本房间中工作的角色

import { ROOM_TRANSFER_TASK } from "setting";

// 任务队列测试

export class Manager {
    constructor(creep: Creep) {
        this.creep_ = creep;
    }

    public work() {
        if (!this.checkTask()) { return; }

        let task = this.creep_.memory.exeTask;
        switch(task.type) {
            case ROOM_TRANSFER_TASK.FILL_NUKE:
                this.fillNuke();
                break;
            default:
                break;
        }
    }

    private checkTask(): boolean {
        let task = this.creep_.memory.exeTask;
        if (!task) {
            // task = this.creep_.room.memory.transferTasks.pop();
            // this.creep_.room.memory.exeTransferTasks.push(task);
            task = this.creep_.room.memory.transferTasks[0];
            this.creep_.room.taskToExe();
            this.creep_.memory.exeTask = task;
            if (!task) { return false; }
        }

        return true;
    }

    private fillNuke() {
        let task = this.creep_.memory.exeTask as iNuke;
        const nuke = Game.getObjectById<StructureNuker>(task.id);
        if (!nuke) {
            console.log('no nuke');
            return;
        }

        let storage = this.creep_.room.storage;
        let terminal = this.creep_.room.terminal;
        // 拿能量
        if (this.creep_.store.getFreeCapacity() > 0) {
            // if (storage && storage.store[RESOURCE_ENERGY] >= 1000)
            if (storage) { this.creep_.getEnergyFrom(storage); }
            else if (terminal) { this.creep_.getEnergyFrom(terminal); }

            console.log('getEnergy');
        }
        // 送能量
        else {
            if (this.creep_.transferTo(nuke, RESOURCE_ENERGY) == OK) {
                this.creep_.room.removeTransferTask(task.type);
                // console.log('remove task');
                delete this.creep_.memory.exeTask;
            }
            console.log('to nuke');
        }
    }

    private creep_: Creep;
}