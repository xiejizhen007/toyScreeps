import { PCTaskType } from "Network/PCTaskSystem";
import { RoomNetwork } from "Network/RoomNetwork";
import { OPERATOR_POWER_COST } from "setting";
import { StoreStructure } from "types";

export class PCOperator {
    creep: PowerCreep;
    roomNetwork: RoomNetwork;
    task: PCTaskType;
    memory: PowerCreepMemory;

    constructor(creep: PowerCreep) {
        this.creep = creep;
        this.roomNetwork = Kernel.roomNetworks[creep.room.name];
        this.memory = creep.memory;
        // this.pcTaskSystem = Kernel.roomNetworks[creep.room.name].pcTaskSystem;
    }

    init(): void {
        this.task = this.roomNetwork.pcTaskSystem.requests[0];
    }

    work(): void {
        if (this.keepAlive()) {
            return;
        }

        if (this.needToClear()) {
            this.transferToCenter();
            return;
        }

        if (this.task) {
            if (!this.haveEnoughResource()) {
                const cost = OPERATOR_POWER_COST[this.task.type];
                this.withdrawResource(cost.resourceType, cost.amount);
                return;
            }

            const target = Game.getObjectById(this.task.target as Id<Structure> | Id<Source>);
            if (target) {
                const ret = this.creep.usePower(this.task.type, target);
                    
                if (ret == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                } else if (ret == OK) {
                    this.roomNetwork.pcTaskSystem.requests.shift();
                }
            }
        } else {
            if (this.creep.powers[PWR_GENERATE_OPS].level >= 1 && this.creep.powers[PWR_GENERATE_OPS].cooldown == 0) {
                this.creep.usePower(PWR_GENERATE_OPS);
            }
        }
    }

    private keepAlive(): boolean {
        if (this.creep.ticksToLive < 150) {
            // find a power spawn
            const spawn = Game.getObjectById(this.creep.memory.keepAlive);
            if (!spawn) {
                const tmpSpawn = this.creep.room.structures.find(f => f.structureType == STRUCTURE_POWER_SPAWN) as StructurePowerSpawn;
                if (tmpSpawn) {
                    this.creep.memory.keepAlive = tmpSpawn.id;
                }
            } else {
                if (this.creep.renew(spawn) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(spawn);
                }
            }
            return true;
        }

        return false;
    }

    private haveEnoughResource(): boolean {
        if (this.task) {
            const cost = OPERATOR_POWER_COST[this.task.type];
            return this.creep.store[cost.resourceType] >= cost.amount;
        }

        return true;
    }

    private withdrawResource(resourceType: ResourceConstant, amount: number) {
        if (this.roomNetwork.storage && this.roomNetwork.storage.store[resourceType] >= amount) {
            return this.withdrawFrom(this.roomNetwork.storage, resourceType, amount);
        } else if (this.roomNetwork.terminal && this.roomNetwork.terminal.store[resourceType] >= amount) {
            return this.withdrawFrom(this.roomNetwork.terminal, resourceType, amount);
        }

        return ERR_NOT_ENOUGH_RESOURCES;
    }

    private withdrawFrom(target: StoreStructure, resourceType: ResourceConstant, amount?: number) {
        if (target) {
            const ret = this.creep.withdraw(target, resourceType, amount);
            if (ret == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }

            return ret;
        }

        return ERR_INVALID_TARGET;
    }

    private needToClear(): boolean {
        if (this.task) {
            const cost = OPERATOR_POWER_COST[this.task.type];
            return false;

        } else if (this.creep.store.getFreeCapacity() <= 50) {
            return true;
        }

        return false;
    }

    private transferToCenter() {
        for (const type in this.creep.store) {
            const resourceType = type as ResourceConstant;
            if (this.roomNetwork.storage && this.roomNetwork.storage.store.getFreeCapacity() > this.creep.store[resourceType]) {
                return this.withdrawFrom(this.roomNetwork.storage, resourceType);
            } else if (this.roomNetwork.terminal && this.roomNetwork.terminal.store.getFreeCapacity() > this.creep.store[resourceType]) {
                return this.withdrawFrom(this.roomNetwork.terminal, resourceType);
            } else {
                return this.creep.drop(resourceType);
            }

            break;
        }
    }

    private transferTo(target: StoreStructure, resourceType: ResourceConstant, amount?: number) {
        if (target) {
            const ret = this.creep.transfer(target, resourceType, amount);
            if (ret == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }

            return ret;
        }

        return ERR_INVALID_TARGET;
    }
}