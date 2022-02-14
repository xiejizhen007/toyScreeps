import { Role } from "Creeps/Role";
import { Tasks } from "Creeps/Task/Tasks";

export class Queen extends Role {
    extensions: (StructureExtension | StructureSpawn)[];

    init(): void {
        this.extensions = _.filter(this.roomNetwork.room.structures, (f: StructureSpawn | StructureExtension) => {
            return (f.structureType == STRUCTURE_EXTENSION || f.structureType == STRUCTURE_SPAWN) && f.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }) as (StructureExtension | StructureSpawn)[];

        if (this.creep.store[RESOURCE_ENERGY] == 0) {
            this.creep.memory.working = false;
        } else if (this.creep.store.getFreeCapacity() == 0) {
            this.creep.memory.working = true;
        }
    }

    work(): void {
        const storage = this.creep.room.storage;
        const terminal = this.creep.room.terminal;

        let energy: StructureStorage | StructureTerminal;
        if (storage && storage.store[RESOURCE_ENERGY] > 0) {
            energy = storage;
        } else if (terminal && terminal.store[RESOURCE_ENERGY] > 0) {
            energy = terminal;
        }

        if (this.creep.memory.working) {
            const extensions = _.filter(this.creep.room.structures, f => f.structureType == STRUCTURE_SPAWN 
                || f.structureType == STRUCTURE_EXTENSION);
            let target = this.creep.pos.findClosestByRange(extensions, {
                filter: (f: StructureSpawn | StructureExtension) => {
                    return f.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            }) as StructureSpawn | StructureExtension;

            if (target) {
                // console.log('target: ', target.pos);
                if (this.creep.pos.isNearTo(target)) {
                    const amount = _.min([this.creep.store[RESOURCE_ENERGY], target.store.getFreeCapacity()]);
                    const ret = this.creep.transfer(target, RESOURCE_ENERGY, amount);
                    if (ret == OK) {
                        target = this.creep.pos.findClosestByRange(extensions, {
                            filter: (f: StructureSpawn | StructureExtension) => {
                                return f.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                        }) as StructureSpawn | StructureExtension;

                        if (target) {
                            this.creep.moveTo(target);
                        }
                    }
                } else {
                    this.creep.moveTo(target);
                }
            }
        } else {
            // if (this.creep.pos.isNearTo(energy)) {
            //     const amount = _.min([this.creep.store.getFreeCapacity(), energy.store[RESOURCE_ENERGY]]);
            //     const ret = this.creep.withdraw(energy, RESOURCE_ENERGY, amount);
            //     if (ret == OK) {
            //         this.creep.memory.working = true;
            //     }
            // } else {
            //     this.creep.moveTo(energy);
            // }
            const target = this.getEnergy();
            if (target) {
                this.getResource(target, RESOURCE_ENERGY);
            }
        }
    }

    private getEnergy(): StructureStorage | StructureTerminal | StructureContainer | Resource | Tombstone | undefined {
        let target: StructureStorage | StructureTerminal | StructureContainer | Resource | Tombstone;

        if (this.roomNetwork.room.storage && this.roomNetwork.room.storage[RESOURCE_ENERGY] > 0) {
            target = this.roomNetwork.room.storage;
        } else if (this.roomNetwork.room.terminal && this.roomNetwork.room.terminal[RESOURCE_ENERGY] > 0) {
            target = this.roomNetwork.room.terminal;
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
}