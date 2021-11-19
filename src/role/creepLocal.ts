// 只会在本房间中工作的角色

import { ROOM_TRANSFER_TASK } from "setting";

// 任务队列测试

export class Manager {
    constructor(creep: Creep) {
        this.creep_ = creep;
        this.storage_ = creep.room.storage;
        this.terminal_ = creep.room.terminal;
    }

    public work() {
        if (!this.checkTask()) { return; }

        let task = this.creep_.memory.exeTask;
        switch(task.type) {
            case ROOM_TRANSFER_TASK.FILL_NUKE:
                this.fillNuke();
                break;
            case ROOM_TRANSFER_TASK.LAB_IN:
                this.labIn();
                break;
            case ROOM_TRANSFER_TASK.FILL_TOWER:
                this.fillTower();
                break;
            case ROOM_TRANSFER_TASK.FILL_POWER_SPAWN:
                this.fillPowerSpawn();
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
            // console.log(task);
            // this.creep_.room.taskToExe();
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
                this.creep_.room.removeTransferTask();
                // console.log('remove task');
                delete this.creep_.memory.exeTask;
            }
            console.log('to nuke');
        }
    }

    /**
     * 把 tower 填到 900 以上
     */
    private fillTower() {
        let task = this.creep_.memory.exeTask as iTower;
        let tower = Game.getObjectById<StructureTower>(task.id);
        console.log('tower: ' + tower);
        if (!tower || tower.store.getUsedCapacity(RESOURCE_ENERGY) >= 900) {
            const towers = this.creep_.room.find(FIND_STRUCTURES, {
                filter: s=> s.structureType == STRUCTURE_TOWER && 
                    s.store[RESOURCE_ENERGY] <= 900
            });

            if (towers.length <= 0) {
                console.log('tower 填充完毕');
                this.creep_.room.removeTransferTask();
                delete this.creep_.memory.exeTask;
                return;
            }

            tower = this.creep_.pos.findClosestByRange(towers) as StructureTower;
            // this.creep_.memory.exeTask.
            task.id = tower.id;
            this.creep_.memory.exeTask = task;
        }

        const amount = Math.min(this.creep_.store.getFreeCapacity(RESOURCE_ENERGY),
            tower.store.getFreeCapacity(RESOURCE_ENERGY));
        
        if (this.creep_.store.getUsedCapacity() == 0) 
            this.creep_.memory.work = false;

        // 默认是 false
        if (this.creep_.memory.work) {
            this.creep_.transferTo(tower, RESOURCE_ENERGY, amount);            
        }
        else {
            let tmp = -1;
            if (this.storage_) { tmp = this.creep_.withdrawFrom(this.storage_, RESOURCE_ENERGY, amount); }
            else if (this.terminal_) { tmp = this.creep_.withdrawFrom(this.terminal_, RESOURCE_ENERGY, amount); }

            if (tmp == OK) {
                this.creep_.memory.work = true;
            }            
        }
    }

    private fillPowerSpawn() {
        const task = this.creep_.memory.exeTask as iPowerSpawn;
        let powerSpawn = Game.getObjectById<StructurePowerSpawn>(task.id);
        if (!powerSpawn) {
            this.creep_.room.removeTransferTask();
            return;
        }
    }

    private labIn() {
        let task = this.creep_.memory.exeTask as iLabIn;
        const lab1 = Game.getObjectById<StructureLab>(task.resource[0].id);
        const lab2 = Game.getObjectById<StructureLab>(task.resource[1].id);

        if (!lab1 || !lab2) { 
            console.log('底物 lab 不存在');
            return; 
        }

        if (task.resource[0].amount <= 0 && task.resource[1].amount <= 0) {
            this.creep_.room.removeTransferTask();
            return;
        }

        let storage = this.creep_.room.storage;
        let terminal = this.creep_.room.terminal;

        if (this.clearLab(lab1, task.resource[0].type) || this.clearLab(lab2, task.resource[1].type)) {
            console.log('clear lab');
            return;
        }

        if (this.creep_.store.getUsedCapacity() > 0) {
            if (this.creep_.store.getUsedCapacity(task.resource[0].type) > 0) {
                if (this.creep_.transferTo(lab1, task.resource[0].type) == OK) {
                    task.resource[0].amount -= this.creep_.store.getUsedCapacity(task.resource[0].type);
                }
            }
            else if (this.creep_.store.getUsedCapacity(task.resource[1].type) > 0) {
                if (this.creep_.transferTo(lab2, task.resource[1].type) == OK) {
                    task.resource[1].amount -= this.creep_.store.getUsedCapacity(task.resource[1].type);
                }
            }
            // 身上有多余的东西，清理掉
            else {

            }

            this.creep_.memory.exeTask = task;
        }
        else {
            if (!this.creep_.pos.inRangeTo(terminal, 1)) {
                this.creep_.goTo(terminal.pos);
                return;
            }

            if (this.creep_.store.getUsedCapacity() > 0) {
                for (let type in this.creep_.store) {
                    let resourceType = type as ResourceConstant;
                    this.creep_.transferTo(terminal, resourceType);
                }
                return;
            }

            let lab = lab1.store[task.resource[0].type] < lab2.store[task.resource[1].type] ? lab1 : lab2;
            if (lab == lab1) {
                let tmp = this.creep_.withdraw(terminal, task.resource[0].type);
            }
            else if (lab == lab2) {
                let tmp = this.creep_.withdraw(terminal, task.resource[1].type);
            }
        }
    }

    /**
     * 
     * @param lab 需要清空的实验室
     * @param resourceType 需要填入的矿物类型 
     * @returns 
     */
    private clearLab(lab: StructureLab, resourceType: ResourceConstant): boolean {
        if (!lab) { return false; }

        // 底物已空，或者底物为需要填入的矿物
        if (!lab.mineralType || lab.mineralType == resourceType) { return false; }

        let storage = this.creep_.room.storage;
        let terminal = this.creep_.room.terminal;

        if (lab.mineralType && this.creep_.store.getFreeCapacity(resourceType) > 0) {
            if (this.creep_.pos.inRangeTo(lab, 1)) {
                this.creep_.withdraw(lab, resourceType);
                return true;
            }

            this.creep_.goTo(lab.pos);
        }
        else if (storage && storage.store.getFreeCapacity() >= this.creep_.store.getUsedCapacity()) {
            this.creep_.transferTo(storage, resourceType);   
        }
        else if (terminal) {
            this.creep_.transferTo(terminal, resourceType);
        }

        return true;
    }

    private creep_: Creep;
    private storage_: StructureStorage;
    private terminal_: StructureTerminal;
}