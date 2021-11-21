// 只会在本房间中工作的角色

import { findLastKey, result } from "lodash";
import { ROOM_TRANSFER_TASK } from "setting";

// 任务队列测试

export class Manager {
    constructor(creep: Creep) {
        this.creep_ = creep;
        this.storage_ = creep.room.storage;
        this.terminal_ = creep.room.terminal;
    }

    public work() {
        if (this.checkLife()) { return; }
        if (!this.checkTask()) { return; }

        let task = this.creep_.memory.exeTask;
        switch(task.type) {
            case ROOM_TRANSFER_TASK.FILL_NUKE:
                this.fillNuke();
                break;
            case ROOM_TRANSFER_TASK.LAB_IN:
                break;
            case ROOM_TRANSFER_TASK.FILL_TOWER:
                this.fillTower();
                break;
            case ROOM_TRANSFER_TASK.FILL_POWERSPAWN:
                this.fillPowerSpawn();
                break;
            case ROOM_TRANSFER_TASK.FILL_EXTENSION:
                this.fillExtension();
            default:
                break;
        }
    }

    private getResource(target: Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode {
        if (!target) { return; }

        if (!this.creep_.pos.inRangeTo(target, 1)) { 
            this.creep_.goTo(target.pos);
            return ERR_NOT_IN_RANGE;
        }

        let ret = this.creep_.withdrawFrom(target, resourceType, amount);
        return ret;        
    }

    private checkLife(): boolean {
        if (this.creep_.ticksToLive <= 20) {
            if (this.creep_.memory.isNeeded) {
                this.creep_.room.addSpawnTask(this.creep_);
                this.creep_.memory.isNeeded = false;
            }
            
            // 身上还有多余的东西
            if (this.creep_.store.getUsedCapacity() > 0) {
                if (this.storage_) {
                    for (let type in this.creep_.store) {
                        const resourceType = type as ResourceConstant;
                        this.creep_.transferTo(this.storage_, resourceType);
                    }
                }
            }

            return true;
        }

        return false;
    }

    private checkTask(): boolean {
        let task = this.creep_.memory.exeTask;
        if (!task) {
            task = this.creep_.room.memory.transferTasks[0];
            this.creep_.memory.exeTask = task;
            if (!task) { return false; }
        }

        return true;
    }

    private fillExtension(): void {
        if (this.creep_.store.getFreeCapacity() == 0) {
            this.creep_.memory.work = true;
        }
        else if (this.creep_.store[RESOURCE_ENERGY] == 0) {
            this.creep_.memory.work = false;
        }

        if (this.creep_.memory.work) {
            let extension = this.creep_.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            }) as StructureExtension;

            if (extension) {
                const amount = Math.min(this.creep_.store[RESOURCE_ENERGY],
                    extension.store.getFreeCapacity(RESOURCE_ENERGY));
                this.creep_.transferTo(extension, RESOURCE_ENERGY, amount);
            }

        }
        else {
            if (this.terminal_) { this.getResource(this.terminal_, RESOURCE_ENERGY); }
            else if (this.storage_) { this.getResource(this.storage_, RESOURCE_ENERGY); }
            else {
                let container = this.creep_.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER
                            && structure.store.getUsedCapacity(RESOURCE_ENERGY) >= this.creep_.store.getFreeCapacity(RESOURCE_ENERGY);
                    }
                }) as StructureContainer;

                if (container) {
                    this.creep_.withdrawFrom(container, RESOURCE_ENERGY);
                }
            }
        }
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
        }
        // 送能量
        else {
            if (this.creep_.transferTo(nuke, RESOURCE_ENERGY) == OK) {
                this.creep_.room.removeTransferTask();
                console.log('nuke 填充完毕');
                delete this.creep_.memory.exeTask;
            }
        }
    }

    /**
     * 把 tower 填到 900 以上
     */
    private fillTower() {
        let task = this.creep_.memory.exeTask as iTower;
        let tower = Game.getObjectById<StructureTower>(task.id);
        if (!tower || tower.store.getUsedCapacity(RESOURCE_ENERGY) >= 900) {
            const towers = this.creep_.room.find(FIND_STRUCTURES, {
                filter: s=> s.structureType == STRUCTURE_TOWER && 
                    s.store[RESOURCE_ENERGY] <= 900
            });

            if (towers.length <= 0) {
                console.log('tower 填充完毕');
                this.creep_.room.removeTransferTask();
                this.creep_.memory.work = false;
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
            console.log('queen: can not find powerSpawn!');
            return;
        }

        if (this.clearCarry(task.resourceType)) { return; }

        const amount = Math.min(this.creep_.store.getFreeCapacity(), powerSpawn.store.getFreeCapacity(task.resourceType));
        if (this.creep_.memory.work) {
            if (this.creep_.transferTo(powerSpawn, task.resourceType) == OK) {
                this.creep_.room.removeTransferTask();
                this.creep_.memory.work = false;
                delete this.creep_.memory.exeTask;
            }
        }   
        else {
            let tmp = -1;
            if (this.terminal_ && this.terminal_.store[task.resourceType] >= amount) { tmp = this.creep_.withdrawFrom(this.terminal_, task.resourceType, amount); }
            else if (this.storage_ && this.storage_.store[task.resourceType] >= amount) { tmp = this.creep_.withdrawFrom(this.storage_, task.resourceType, amount); }

            if (tmp == OK) {
                this.creep_.memory.work = true;
            }

            // console.log('manager: ' + task.resourceType + ' amount: ' + amount + ' return ' + tmp);
        }     
    }

    private labIn() {
        if (!this.terminal_) { return; }

        let task = this.creep_.memory.exeTask as iLabIn;
        let lab1 = Game.getObjectById(task.resource[0].id) as StructureLab;
        let lab2 = Game.getObjectById(task.resource[1].id) as StructureLab;
        if (!lab1 || !lab2) {
            console.log('manager: lab 不存在');
            this.creep_.room.removeTransferTask();
            return;
        }

        let resource = task.resource;
        if (this.clearLab(lab1, resource[0].type) 
            || this.clearLab(lab2, resource[1].type)) {
                return;
        }

        
    }

    private labOut() {

    }

    /**
     * 清除 lab 资源，除非资源类型是 resourceType
     * @param target lab
     * @param resourceType 
     * @returns 
     */
    private clearLab(target: StructureLab, resourceType: ResourceConstant) {
        if (target.mineralType && target.mineralType != resourceType) {
            const amount = Math.min(this.creep_.store.getFreeCapacity(), 
                target.store[target.mineralType]);
            
            if (this.creep_.store[target.mineralType] > 0) {
                this.creep_.transferTo(this.terminal_, target.mineralType);
            } else {
                this.creep_.withdrawFrom(target, target.mineralType, amount);
            }

            return true;
        }

        return false;
    }

    private clearCarryingEnergy(): boolean {
        if (this.storage_ && this.creep_.store[RESOURCE_ENERGY] > 0) {
            if (this.creep_.transferTo(this.storage_, RESOURCE_ENERGY) == ERR_FULL) 
                this.creep_.drop(RESOURCE_ENERGY);
            return true;
        }

        return false;
    }

    /**
     * 除去身上多余的资源
     * @param resourceType 保留的资源
     * @returns 是否需要清理
     */
    private clearCarry(resourceType: ResourceConstant): boolean {
        for (let type in this.creep_.store) {
            if (type != resourceType) {
                if (this.storage_ && this.storage_.store.getFreeCapacity() >= this.creep_.store[type]) {
                    this.creep_.transferTo(this.storage_, type as ResourceConstant);
                }
                else if (this.terminal_ && this.terminal_.store.getFreeCapacity() >= this.creep_.store[type]) {
                    this.creep_.transferTo(this.terminal_, type as ResourceConstant);
                }
                else { this.creep_.drop(type as ResourceConstant); }
                return true;
            }
        }

        return false;
    }

    private creep_: Creep;
    private storage_: StructureStorage;
    private terminal_: StructureTerminal;
}