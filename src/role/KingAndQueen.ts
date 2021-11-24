// // 只会在本房间中工作的角色

import { findLastKey, result } from "lodash";
import { CREEP_STATE, ROOM_TRANSFER_TASK } from "setting";
import { getObject } from "utils";
import { Role } from "./role";

export class Queen extends Role {
    /**
     * queen 干活入口
     * 高级管理员 
     */
    public override work() {
        if (this.creep_.spawning) { return; }
        if (this.checkLife()) { return; }
        super.work();
        // this.creep_.say('work');
    }

    /**
     * 检查任务
     */
    protected override prepare() {
        this.creep_.memory.exeTask = this.creep_.room.getTransferTask();
        if (this.creep_.memory.exeTask) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
        }
    }
    
    protected override source() {
        const task = this.creep_.memory.exeTask;
        let resourceType: ResourceConstant;
        let resourceAmount = 1e10;
        
        if (!task) {
            this.creep_.memory.state = CREEP_STATE.PREPARE;
            this.creep_.room.removeTransferTask();
            delete this.creep_.memory.exeTask;
            return;
        }

        // 根据任务类型取 resourceType
        if (task.type == ROOM_TRANSFER_TASK.FILL_EXTENSION
        || task.type == ROOM_TRANSFER_TASK.FILL_TOWER) {    
            resourceType = RESOURCE_ENERGY;
        } else if (task.type == ROOM_TRANSFER_TASK.FILL_NUKER
        || task.type == ROOM_TRANSFER_TASK.FILL_POWERSPAWN) {
            const taskType = task as iNuke | iPowerSpawn;
            let target = getObject(taskType.id) as StructureNuker | StructurePowerSpawn;
            resourceType = taskType.resourceType;
            resourceAmount = target.store.getFreeCapacity(resourceType);
        } else if (task.type == ROOM_TRANSFER_TASK.LAB_IN) {
            const labTask = task as iLabIn;
            resourceType = labTask.resource[0].amount < labTask.resource[1].amount ?
                labTask.resource[1].type : labTask.resource[0].type;
        } else if (task.type == ROOM_TRANSFER_TASK.LAB_OUT) {
            // 需要到 lab 去取资源，跟其他的不太一样
            this.creep_.memory.state = CREEP_STATE.TARGET;
            return;
        } else {
            this.creep_.memory.state = CREEP_STATE.PREPARE;
            return;
        }

        const storage = this.creep_.room.storage;
        const terminal = this.creep_.room.terminal;

        this.creep_.memory.resourceType = resourceType;

        let amount = 0;
        // 先在 terminal 取，不够再去 storage 取
        if (terminal && terminal.store[resourceType] > 0) {
            amount = Math.min(this.creep_.store.getFreeCapacity(resourceType), terminal.store[resourceType], resourceAmount);
            const tmp = this.creep_.withdrawFrom(terminal, resourceType, amount);
            if (tmp == OK || tmp == ERR_FULL) {
                this.creep_.memory.state = CREEP_STATE.TARGET;
            }
        } else if (storage && storage.store[resourceType] > 0) {
            amount = Math.min(this.creep_.store.getFreeCapacity(resourceType), storage.store[resourceType], resourceAmount);
            const tmp = this.creep_.withdrawFrom(storage, resourceType, amount);
            if (tmp == OK || tmp == ERR_FULL) {
                this.creep_.memory.state = CREEP_STATE.TARGET;
            } 
        } else {
            // 没有资源了，可以考虑取消任务了
            this.creep_.memory.state = CREEP_STATE.PREPARE;
            this.creep_.room.removeTransferTask();
            delete this.creep_.memory.exeTask;
            // console.log('没资源了，清理任务');
        }
    }

    protected override target() {
        const task = this.creep_.memory.exeTask;
        if (!task) {
            this.creep_.memory.state = CREEP_STATE.PREPARE;
            return;
        }
        
        if (this.clearCarry(this.creep_.memory.resourceType)) {
            return;
        }

        switch (task.type) {
            case ROOM_TRANSFER_TASK.FILL_EXTENSION:
                this.fillExtension();
                break;
            case ROOM_TRANSFER_TASK.FILL_TOWER:
                this.fillTower();
                break;
            case ROOM_TRANSFER_TASK.FILL_POWERSPAWN:
                this.fillPowerSpawn();
                break;
            case ROOM_TRANSFER_TASK.FILL_NUKER:
                this.fillNuker();
                break;
            case ROOM_TRANSFER_TASK.LAB_IN:
                this.labIn();
                break;
            case ROOM_TRANSFER_TASK.LAB_OUT:
                this.labOut();
                break;
            default:
                // 没找到的任务类型，重新找任务
                this.creep_.memory.state = CREEP_STATE.PREPARE;
                break;
        }
    }

    /**
     * 填充 spawn 和 extension
     */
    private fillExtension(): void {
        if (this.creep_.store[RESOURCE_ENERGY] == 0) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
            return;
        }

        let target = Game.getObjectById(this.creep_.memory.target) as StructureExtension | StructureSpawn;
        // 目标不存在、或者是已经装满了，就重新找
        // 可能需要判断 target 是不是 spawn 或者 extension
        if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            target = this.creep_.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_EXTENSION || 
                    s.structureType == STRUCTURE_SPAWN) && 
                    s.store.getFreeCapacity(RESOURCE_ENERGY) != 0
            });

            if (target) {
                this.creep_.memory.target = target.id;
            } else {
                this.creep_.room.removeTransferTask();
                delete this.creep_.memory.exeTask;
                return;
            }
        }

        if (target) {
            const amount = Math.min(this.creep_.store[RESOURCE_ENERGY], target.store.getFreeCapacity(RESOURCE_ENERGY));
            this.creep_.transferTo(target, RESOURCE_ENERGY, amount);
        }
    }

    /**
     * 填充 tower 
     */
    private fillTower(): void {
        if (this.creep_.store[RESOURCE_ENERGY] == 0) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
            return;
        }

        let target = Game.getObjectById(this.creep_.memory.target) as StructureTower;
        if (!target || target.store[RESOURCE_ENERGY] > 900 || target.structureType != STRUCTURE_TOWER) {
            target = this.creep_.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_TOWER && 
                    s.store[RESOURCE_ENERGY] <= 900
            });

            if (target) {
                this.creep_.memory.target = target.id;
            } else {
                // console.log('tower 填充完毕');
                this.creep_.room.removeTransferTask();
                delete this.creep_.memory.target;
                delete this.creep_.memory.exeTask;
                return;
            }
        }

        const amount = Math.min(this.creep_.store[RESOURCE_ENERGY], target.store.getFreeCapacity(RESOURCE_ENERGY));
        this.creep_.transferTo(target, RESOURCE_ENERGY, amount);
    }

    /**
     * 只做一次
     */
    private fillPowerSpawn(): void {
        const task = this.creep_.memory.exeTask as iPowerSpawn;
        if (this.creep_.store[task.resourceType] == 0) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
            return;
        }

        let target = Game.getObjectById(this.creep_.room.memory.powerSpawnID) as StructurePowerSpawn;
        if (!target) {
            target = this.creep_.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_POWER_SPAWN
            });

            if (target) {
                this.creep_.room.memory.powerSpawnID = target.id;
            } else {
                console.log('powerSpawn 找不到！！！');
                this.creep_.room.removeTransferTask();
                delete this.creep_.memory.exeTask;
                return;
            }
        }

        // target 一定存在
        const amount = Math.min(target.store.getFreeCapacity(task.resourceType), this.creep_.store[task.resourceType]);
        // 完成任务了
        let tmp = this.creep_.transferTo(target, task.resourceType, amount);
        if (tmp == OK || tmp == ERR_FULL) {
            this.creep_.room.removeTransferTask();
            delete this.creep_.memory.exeTask;
            // console.log("powerSpawn 填充完毕");
        }
    }

    /**
     * 只做一次 
     */
    private fillNuker(): void {
        const task = this.creep_.memory.exeTask as iNuke;
        if (this.creep_.store[task.resourceType] == 0) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
            return;
        }

        let target = Game.getObjectById(task.id) as StructureNuker;
        if (!target) {
            target = this.creep_.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_NUKER
            });

            if (target) {
                this.creep_.room.memory.nuker = target.id;
            } else {
                this.creep_.room.removeTransferTask();
                delete this.creep_.memory.exeTask;
                return;
            }
        }

        const amount = Math.min(this.creep_.store[task.resourceType], target.store.getFreeCapacity(task.resourceType));
        if (this.creep_.transferTo(target, task.resourceType, amount) == OK) {
            this.creep_.room.removeTransferTask();
            delete this.creep_.memory.exeTask;
            // console.log("nuker 填充完毕");
        }
    }

    /**
     * 送入足够数量的 resource
     */
    private labIn(): void {
        let task = this.creep_.memory.exeTask as iLabIn;
        if (this.creep_.store[this.creep_.memory.resourceType] == 0) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
            return;
        }
        
        if (task.resource[0].amount <= 0 && task.resource[1].amount <= 0) {
            console.log("inLab 任务完成");
            this.creep_.room.removeTransferTask();
            this.creep_.memory.state = CREEP_STATE.PREPARE;
            return;
        }

        let targetTask = task.resource[0].type == this.creep_.memory.resourceType ?
            task.resource[0] : task.resource[1];
        let target = Game.getObjectById(targetTask.id) as StructureLab;
        if (!target) {
            console.log("没有 inLab！");
            this.creep_.room.removeTransferTask();
            delete this.creep_.memory.exeTask;
            this.creep_.memory.state = CREEP_STATE.PREPARE;
            return;
        }

        const amount = Math.min(this.creep_.store[this.creep_.memory.resourceType], 
            target.store.getFreeCapacity(targetTask.type));
        
        if (this.creep_.transferTo(target, targetTask.type, amount) == OK) {
            if (targetTask.id == task.resource[0].id) {
                task.resource[0].amount -= amount;
            } else if (targetTask.id == task.resource[1].id) {
                task.resource[1].amount -= amount;
            } 

            this.creep_.memory.exeTask = task;
        }
    }

    /**
     * 清理 lab 反应残留资源
     * 直接清理，不经过 source()
     */
    private labOut(): void {
        const storage = this.creep_.room.storage; 
        const terminal = this.creep_.room.terminal;

        // 剩下来就找最近的
        let targetID = this.creep_.room.memory.lab.labsID.find(f => {
            let lab = getObject(f) as StructureLab;
            return lab.mineralType;
        });

        let target = getObject(targetID) as StructureLab;
        // out lab 都没有剩余的矿产了
        if (!target) {
            let labInputs = [
                getObject(this.creep_.room.memory.lab.lab1ID),
                getObject(this.creep_.room.memory.lab.lab2ID),
            ] as StructureLab[];
            
            target = this.creep_.pos.findClosestByRange(labInputs, {
                filter: (s: StructureLab) => {
                    return s.mineralType;
                }
            });
        }

        // lab 存在矿产
        if (target && target.mineralType) {
            const amount = Math.min(target.store[target.mineralType], this.creep_.store.getFreeCapacity());
            this.creep_.withdrawFrom(target, target.mineralType, amount);
        }

        if (!target || !target.mineralType || this.creep_.store.getFreeCapacity() == 0) {
            // 没有矿产了，该回去了
            let ret: ScreepsReturnCode;
            if (terminal && terminal.store.getFreeCapacity() > this.creep_.store.getUsedCapacity()) {
                ret = this.creep_.clearBody(terminal);
            } else if (storage && storage.store.getFreeCapacity() > this.creep_.store.getUsedCapacity()) {
                ret = this.creep_.clearBody(storage);
            }
            
            if (!target) {
                this.creep_.room.removeTransferTask();
                delete this.creep_.memory.exeTask;
                this.creep_.memory.state = CREEP_STATE.PREPARE;
            }
        }

        // 进一步，全扔了
    }

    // 工具类方法

    /**
     * 清理不是 resourceType 的资源
     * @param resourceType 保留的资源类型
     */
    private clearCarry(resourceType: ResourceConstant): boolean {
        if (!resourceType) { return; }
        // 身上只剩下 resourceType 了
        if (this.creep_.store[resourceType] == this.creep_.store.getUsedCapacity()) {
            return false;
        }

        const storage = this.creep_.room.storage;

        for (let type in this.creep_.store) {
            if (type != resourceType) {
                let ret = this.creep_.transferTo(storage, type as ResourceConstant);
                if (ret == ERR_FULL) {
                    this.creep_.drop(type as ResourceConstant);
                }
            }
        }

        return true;
    }

    /**
     * 是否继续孵化干活
     * 处理身上的资源，避免浪费
     * @returns 是否处理后事
     */
    private checkLife(): boolean {
        if (this.creep_.ticksToLive <= 3 * this.creep_.body.length) {
            if (this.creep_.memory.exeTask) {
                this.creep_.room.memory.transferTasks[0] = this.creep_.memory.exeTask;
            }
            if (this.creep_.memory.isNeeded) {
                this.creep_.room.addSpawnTask(this.creep_);
                this.creep_.memory.isNeeded = false;
            }
            
            const storage = this.creep_.room.storage;
            const terminal = this.creep_.room.terminal;
            if (storage) {
                this.creep_.clearBody(storage);
            } else if (terminal) {
                this.creep_.clearBody(terminal);
            }

            return true;
        }

        return false;
    }
}