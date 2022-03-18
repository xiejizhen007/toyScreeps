import { Role } from "Creeps/Role";
import { LogisticsNetwork } from "Network/LogisticsNetwork";


/**
 * 负责房间内的物流传输
 * 传输能量，资源等
 * 
 * TODO: 处理在执行任务时，清理自身多余的资源
 * TODO: 改变低等级时的逻辑，尤其是没有 storage 的情况下
 */
export class Queen extends Role {
    logisticsNetwork: LogisticsNetwork;

    init(): void {
        this.logisticsNetwork = this.roomNetwork.logisticsNetwork;

        if (this.store.getFreeCapacity() == 0) {
            this.isWorking = true;
        } else if (this.store.getUsedCapacity() == 0) {
            this.isWorking = false;
        }
    }

    work(): void {
        if (this.spawning) {
            return;
        }

        if (this.ticksToLive < 15) {
            this.tickToDie();
            return;
        }

        if (!this.memory.transferTask) { 
            this.logisticsNetwork.findAGoodJob(this);
        }

        if (this.memory.transferTask) {
            const request = this.memory.transferTask;

            if (this.isWorking) {
                if (request.resourceType != 'all' && this.store[request.resourceType] != this.store.getUsedCapacity()) {
                    this.transferToCenter();
                    return;
                }

                if (request.target == 'any') {
                    this.transferToCenter();
                    return;
                }

                const target = Game.getObjectById(this.memory.transferTask.target as Id<Structure>);
                if (!target) {
                    this.logisticsNetwork.removeDoingJob(this);
                    return;
                }

                if (target.structureType == STRUCTURE_EXTENSION || target.structureType == STRUCTURE_SPAWN) {
                    this.handleExtension();
                } else if (target.structureType == STRUCTURE_LAB) {
                    this.handleLabInput();
                } else if (target.structureType == STRUCTURE_TOWER) {
                    this.handleTower();
                }
            } else {
                this.getResource();
            }

        } else {
            // 仍然找不到任务，清空自身
            if (this.store.getUsedCapacity() == 0) {
                return;
            }

            this.transferToCenter();
        }
    }

    // 死亡处理，扔掉手上的任务
    private tickToDie() {
        this.transferToCenter();
    }

    private getResource() {
        const request = this.memory.transferTask;
        const source = Game.getObjectById(request.source) as RoomObject;

        if (source) {
            if (this.pos.isNearTo(source)) {
                if (source instanceof Structure) {
                    if (source instanceof StructureStorage || source instanceof StructureTerminal) {
                        if (request.resourceType != 'all') {
                            const amount = Math.min(this.store.getFreeCapacity(), source.store[request.resourceType]);
                            this.withdraw(source, request.resourceType, amount);
                            this.isWorking = true;
                        }
                    } else if (source instanceof StructureLab) {
                        this.handleLabOutput();
                    }
                } else if (source instanceof Resource) {

                } else if (source instanceof Ruin) {

                } else if (source instanceof Tombstone) {

                }
            } else {
                this.goto(source);
            }
        } else if (request.source == 'any') {
            // 不指定输入源，从各个地方找
            let target: any;

            if (this.roomNetwork.storage && this.roomNetwork.storage.store[request.resourceType] > 0) {
                target = this.roomNetwork.storage;
                if (this.pos.isNearTo(target)) {
                    const amount = Math.min(this.store.getFreeCapacity(), target.store[request.resourceType]);
                    const ret = this.withdraw(target, request.resourceType as ResourceConstant, amount);
                } else {
                    this.goto(target);
                }
            } else if (this.roomNetwork.terminal && this.roomNetwork.terminal.store[request.resourceType] > 0) {
                target = this.roomNetwork.terminal;
                if (this.pos.isNearTo(target)) {
                    const amount = Math.min(this.store.getFreeCapacity(), target.store[request.resourceType]);
                    const ret = this.withdraw(target, request.resourceType as ResourceConstant, amount);
                } else {
                    this.goto(target);
                }
            } else if (request.resourceType == 'energy') {
                // this.logisticsNetwork.removeDoingJob(this);
                const sources = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (sources && sources.resourceType == 'energy') {
                    if (this.pos.isNearTo(sources)) {
                        this.pickup(sources);
                    } else {
                        this.goto(sources);
                    }
                } else {
                    this.logisticsNetwork.removeDoingJob(this);
                }
            } else {
                this.logisticsNetwork.removeDoingJob(this);
            }
        }
    }

    private transferToCenter() {
        let target: StructureStorage | StructureTerminal;

        if (this.roomNetwork.storage && this.roomNetwork.storage.store.getFreeCapacity() > 0) {
            target = this.roomNetwork.storage;
        } else if (this.roomNetwork.terminal && this.roomNetwork.terminal.store.getFreeCapacity() > 0) {
            target = this.roomNetwork.terminal;
        }

        if (target) {
            if (this.pos.isNearTo(target)) {
                for (const resourceType in this.store) {
                    const amount = Math.min(this.store[resourceType], target.store.getFreeCapacity());
                    this.transfer(target, resourceType as ResourceConstant, amount);
                    break;
                }
            } else {
                this.goto(target);
            }
        }
    }

    private handleExtension() {
        const target = Game.getObjectById(this.memory.transferTask.target as Id<StructureSpawn> | Id<StructureExtension>);
        if (target) {
            let ret: ScreepsReturnCode;
            const amount = Math.min(target.store.getFreeCapacity(RESOURCE_ENERGY), this.store[RESOURCE_ENERGY]);

            if (this.pos.isNearTo(target)) {
                ret = this.transfer(target, RESOURCE_ENERGY, amount);
            } else {
                ret = ERR_NOT_IN_RANGE;
                this.goto(target);
            }

            if (ret == OK || amount == 0) {
                this.logisticsNetwork.removeDoingJob(this);

                // 找到下一个任务点
                {
                    const yes = this.logisticsNetwork.findAGoodJobByStructureType(this, STRUCTURE_EXTENSION);
                    if (!yes) {
                        this.logisticsNetwork.findAGoodJobByStructureType(this, STRUCTURE_SPAWN);
                    }
                }

                // 任务存在
                if (this.memory.transferTask) {
                    const nextTarget = Game.getObjectById(this.memory.transferTask.target as Id<StructureSpawn> | Id<StructureExtension>);
                    if (nextTarget && !this.pos.isNearTo(nextTarget) && this.store[RESOURCE_ENERGY] > 0) {
                        this.goto(nextTarget);
                    }
                }
            }

            return ret;
        }
    }

    private handleTower() {
        const target = Game.getObjectById(this.memory.transferTask.target as Id<StructureTower>);
        if (target) {
            let ret: ScreepsReturnCode;
            const amount = Math.min(target.store.getFreeCapacity(RESOURCE_ENERGY), this.store[RESOURCE_ENERGY]);

            if (this.pos.isNearTo(target)) {
                ret = this.transfer(target, RESOURCE_ENERGY, amount);
            } else {
                ret = ERR_NOT_IN_RANGE;
                this.goto(target);
            }

            if (ret == OK || amount == 0) {
                this.logisticsNetwork.removeDoingJob(this);
                // 找到下一个任务点
                {
                    this.logisticsNetwork.findAGoodJobByStructureType(this, STRUCTURE_TOWER);
                }

                // 任务存在
                if (this.memory.transferTask) {
                    const nextTarget = Game.getObjectById(this.memory.transferTask.target as Id<StructureTower>);
                    if (nextTarget && !this.pos.isNearTo(nextTarget) && this.store[RESOURCE_ENERGY] > 0) {
                        this.goto(nextTarget);
                    }
                }
            }

            return ret;
        }
    }

    /**
     * 负责处理 lab 的输入的
     */
    private handleLabInput() {
        const request = this.memory.transferTask;
        
        if (request) {
            const target = Game.getObjectById(request.target as Id<StructureLab>);

            let ret: ScreepsReturnCode;
            const amount = Math.min(target.store.getFreeCapacity(request.resourceType as ResourceConstant), this.store[request.resourceType]);

            if (this.pos.isNearTo(target)) {
                const realAmount = amount == 0 ? this.store[request.resourceType] : amount;
                ret = this.transfer(target, request.resourceType as ResourceConstant, realAmount);
                // console.log('ret: ' + ret + ' amount: ' + realAmount);
         } else {
                ret = ERR_NOT_IN_RANGE;
                this.goto(target);
            }

            if (ret == OK || target.store[request.resourceType] >= request.amount) {
                this.logisticsNetwork.removeDoingJob(this);
                // console.log('ret: ' + ret + ' amount: ' + target.store[request.resourceType]);
            }
            return ret;
        }
    }

    private handleLabOutput() {
        const request = this.memory.transferTask;
        if (request) {
            const lab = Game.getObjectById(request.source as Id<StructureLab>);
            let ret: ScreepsReturnCode;

            if (lab.mineralType) {
                const amount = Math.min(this.store.getFreeCapacity(), lab.store[lab.mineralType]);
                if (this.pos.isNearTo(lab)) {
                    ret = this.withdraw(lab, lab.mineralType, amount);
                } else {
                    ret = ERR_NOT_IN_RANGE;
                    this.goto(lab);
                }
            }

            if (ret == OK) {
                this.logisticsNetwork.removeDoingJob(this);
            }

            return ret;
        }
    }
}