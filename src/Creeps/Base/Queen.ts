import { Role } from "Creeps/Role";

export class Queen extends Role {
    init(): void {
        if (this.creep.store[RESOURCE_ENERGY] == 0) {
            this.creep.memory.working = false;
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
            if (this.creep.pos.isNearTo(energy)) {
                const amount = _.min([this.creep.store.getFreeCapacity(), energy.store[RESOURCE_ENERGY]]);
                const ret = this.creep.withdraw(energy, RESOURCE_ENERGY, amount);
                if (ret == OK) {
                    this.creep.memory.working = true;
                }
            } else {
                this.creep.moveTo(energy);
            }
        }
    }
}