import { Role } from "Creeps/Role";
import { TransportRequest } from "Network/TransportNetwork";

export class Queen extends Role {
    spawns: StructureSpawn[];
    extensions: StructureExtension[];
    towers: StructureTower[];

    tempTaskType = {
        'idle': 'idle',
        'fillExtension': 'fillExtension',
        'fillTower': 'fillTower',
        'handleInput': 'handleInput',
        'handleOutput': 'handleOutput',
    };

    init(): void {
        this.spawns = this.roomNetwork.spawns;
        this.extensions = this.roomNetwork.extensions;
        this.towers = this.roomNetwork.towers;

        if (!this.memory.tempTask) {
            this.memory.tempTask = {
                type: this.tempTaskType.idle
            };
        }
    }

    work(): void {
        // this.creep.sayHello();

        this.tempWork();
    }

    private getEnergy(): StructureStorage | StructureTerminal | StructureContainer | Resource | Tombstone | undefined {
        let target: StructureStorage | StructureTerminal | StructureContainer | Resource | Tombstone;

        if (this.roomNetwork.room.storage && this.roomNetwork.room.storage.store[RESOURCE_ENERGY] > 0) {
            target = this.roomNetwork.room.storage;
        } else if (this.roomNetwork.room.terminal && this.roomNetwork.room.terminal.store[RESOURCE_ENERGY] > 0) {
            target = this.roomNetwork.room.terminal;
        } else if (_.find(this.roomNetwork.containers, f => f.store[RESOURCE_ENERGY] > 100)) {
            const containers = _.filter(this.roomNetwork.containers, f => f.store[RESOURCE_ENERGY] > 100);
            target = this.creep.pos.findClosestByRange(containers);
        } else if (this.roomNetwork.room.find(FIND_DROPPED_RESOURCES).length) {
            target = this.creep.pos.findClosestByRange(this.roomNetwork.room.find(FIND_DROPPED_RESOURCES));
        }

        return target;
    }

    private getResource(target: Structure | Resource | Tombstone, resourceType = RESOURCE_ENERGY as ResourceConstant,
                        amount?: number): ScreepsReturnCode {
        if (target instanceof StructureStorage || target instanceof StructureTerminal 
            || target instanceof StructureContainer) {
            const minAmount = Math.min(target.store[resourceType], this.creep.store.getFreeCapacity(), amount);
            return this.creep.withdrawFrom(target, resourceType, minAmount);
        } else if (target instanceof Resource) {
            if (this.creep.pos.isNearTo(target)) {
                this.creep.pickup(target);
            } else {
                this.creep.goto(target.pos);
            }
        }
        return OK;
    }
    
    private updateTask(): void {
        if (this.haveFillExtension()) {
            this.memory.tempTask.type = this.tempTaskType.fillExtension;
        } else if (this.haveFillTower()) {
            this.memory.tempTask.type = this.tempTaskType.fillTower;
        } else if (this.haveInputTask()) {
            this.memory.tempTask.type = this.tempTaskType.handleInput;
        } else if (this.haveOutputTask()) {
            this.memory.tempTask.type = this.tempTaskType.handleOutput;
        } else {
            this.memory.tempTask.type = this.tempTaskType.idle;
        }
    }

    private haveFillExtension(): boolean {
        let target = _.find(this.spawns, f => f.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
        if (target) {
            return true;
        }

        let target1 = _.find(this.extensions, f => f.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
        if (target1) {
            return true;
        }

        return false;
    }

    private haveFillTower(): boolean {
        const target = _.find(this.towers, f => f.store[RESOURCE_ENERGY] < 700);
        return target ? true : false;
    }

    private tempWork() {
        switch (this.memory.tempTask.type) {
            case this.tempTaskType.fillExtension:
                this.fillExtension();
                break;

            case this.tempTaskType.fillTower:
                this.fillTower();
                break;

            case this.tempTaskType.handleInput:
                this.handleInputTask();
                break;

            case this.tempTaskType.handleOutput:
                this.handleOutputTask();
                break;

            default:
                this.updateTask();
                break;
        }

        if (this.memory.tempTask.type == this.tempTaskType.idle) {
            this.transferAllToCenter();
        }
    }

    private fillExtension() {
        // let exts: (StructureSpawn | StructureExtension)[];
        let exts = [];
        if (this.store[RESOURCE_ENERGY] == 0) {
            delete this.memory.tempTask.target;
            const target = this.getEnergy();
            return this.getResource(target, RESOURCE_ENERGY);
        } else {
            exts = exts.concat(this.extensions, this.spawns);

            let target = Game.getObjectById(this.memory.tempTask.target as Id<StructureSpawn> | Id<StructureExtension>);
            if (target) {
                let ret: ScreepsReturnCode;
                if (this.pos.isNearTo(target)) {
                    const amount = Math.min(target.store.getFreeCapacity(), this.store[RESOURCE_ENERGY]);
                    ret = this.creep.transfer(target, RESOURCE_ENERGY, amount);
                } else {
                    ret = ERR_NOT_IN_RANGE;
                    this.creep.goto(target.pos);
                }

                if (ret == OK || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    const nowTarget = target;
                    target = this.pos.findClosestByRange(_.filter(exts, f => f.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && f.id != nowTarget.id));
                    if (target) {
                        this.memory.tempTask.target = target.id;
                        if (!this.pos.isNearTo(target) && this.store[RESOURCE_ENERGY] > 0) {
                            this.creep.goto(target.pos);
                        }
                    } else {
                        this.memory.tempTask.type = this.tempTaskType.idle;
                    }
                }

                return ret;
            } else {
                target = this.pos.findClosestByRange(_.filter(exts, f => f.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
            }

            if (target && target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                this.memory.tempTask.target = target.id;
            } else {
                this.memory.tempTask.type = this.tempTaskType.idle;
            }

            return ERR_BUSY;
        }
    }

    private fillTower() {
        if (this.store[RESOURCE_ENERGY] == 0) {
            delete this.memory.tempTask.target;
            const target = this.getEnergy();
            return this.getResource(target, RESOURCE_ENERGY);
        } else {
            let target = Game.getObjectById(this.memory.tempTask.target as Id<StructureTower>);
            if (target) {
                let ret: ScreepsReturnCode;
                if (this.pos.isNearTo(target)) {
                    const amount = Math.min(this.creep.store[RESOURCE_ENERGY], target.store.getFreeCapacity());
                    ret = this.creep.transfer(target, RESOURCE_ENERGY, amount);
                } else {
                    ret = ERR_NOT_IN_RANGE;
                    this.creep.goto(target.pos);
                }

                if (ret == OK || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    const nowTarget = target;
                    target = this.pos.findClosestByRange(_.filter(this.towers, f => f.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && f.id != nowTarget.id));
                    if (target) {
                        this.memory.tempTask.target = target.id;
                        if (!this.pos.isNearTo(target) && this.store[RESOURCE_ENERGY] > 0) {
                            this.creep.goto(target.pos);
                        }
                    } else {
                        this.memory.tempTask.type = this.tempTaskType.idle;
                    }
                }

                return ret;
            } else {
                target = this.pos.findClosestByRange(_.filter(this.towers, f => f.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
            }

            if (target) {
                this.memory.tempTask.target = target.id;
            } else {
                this.memory.tempTask.type = this.tempTaskType.idle;
            }

            return ERR_BUSY;
        }
    }

    // TODO: 处理 lab 任务

    private haveInputTask(): boolean {
        return this.roomNetwork.transportNetwork.haveInputRequest();
    }

    private haveOutputTask() {
        return this.roomNetwork.transportNetwork.haveOutputRequest();
    }

    private handleInputTask() {
        // backup request
        let request = this.roomNetwork.transportNetwork.findHighPriorityInputRequest();
        
        if (this.creep.store[request.resourceType] > 0) {
            if (this.creep.pos.isNearTo(request.target)) {
                const amount = Math.min(request.amount, this.creep.store[request.resourceType]);
                this.creep.transfer(request.target, request.resourceType, amount);
            } else {
                this.creep.goto(request.target.pos);
            }
        } else {
            let target: StructureStorage | StructureTerminal;
            
            if (this.roomNetwork.storage && this.roomNetwork.storage.store[request.resourceType] > 0) {
                target = this.roomNetwork.storage;
            } else if (this.roomNetwork.terminal && this.roomNetwork.terminal.store[request.resourceType] > 0) {
                target = this.roomNetwork.terminal;
            }

            if (target) {
                if (this.creep.pos.isNearTo(target)) {
                    const amount = Math.min(request.amount, this.creep.store.getFreeCapacity(request.resourceType));
                    this.creep.withdraw(request.target, request.resourceType, amount);
                } else {
                    this.creep.goto(target.pos);
                }
            }
        }
    }

    private handleOutputTask() {
        let request = this.roomNetwork.transportNetwork.findHighPriorityOutputRequest();

        if (this.creep.store.getFreeCapacity() == 0 || !request) {
            this.transferAllToCenter();
        } else {
            if (this.creep.pos.isNearTo(request.target)) {
                const amount = Math.min(request.amount, this.creep.store.getFreeCapacity());
                this.creep.withdraw(request.target, request.resourceType, amount);
            } else {
                this.creep.goto(request.target.pos);
            }
        }
    }

    private transferAllToCenter() {
        if (this.roomNetwork.terminal) {
            this.transferAllTo(this.roomNetwork.terminal);
        } else if (this.roomNetwork.storage) {
            this.transferAllTo(this.roomNetwork.storage);
        }
    }

    private transferAllTo(target: StructureStorage | StructureTerminal) {
        if (this.creep.pos.isNearTo(target)) {
            for (const resourceType in this.creep.store) {
                this.creep.transfer(target, resourceType as ResourceConstant);
                break;
            }
        } else {
            this.creep.goto(target.pos);
        }
    }
}