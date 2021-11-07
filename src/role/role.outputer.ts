export const roleOutputer = {
    /**
     * 在 storage 中送能量到 拓展包 extension，防御塔 tower
     */
    run:function(creep : Creep) {
        if (!creep || creep.spawning) {
            return;
        }

        if ((creep.ticksToLive < 50 || creep.hits < creep.hitsMax) && creep.memory.isNeeded) {
            let room = Game.rooms[creep.memory.room];
            if (!room) {
                console.log('room dose not exist: ' + creep.memory.room);
                return;
            }

            room.memory.spawnTasks.push({
                role: creep.memory.role, room: creep.memory.room, isNeeded: true,
                task: creep.memory.task
            });

            creep.memory.isNeeded = false;
            console.log('new mission by ' + creep.name);
        }

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.work = true;
        } 
        else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.work = false;
        }

        // 送能量
        if (creep.memory.work) {
            let tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            }) as StructureTower;

            if (tower) {
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
                else if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_FULL) {
                    creep.transfer(tower, RESOURCE_ENERGY, tower.store.getFreeCapacity(RESOURCE_ENERGY));
                }
                return;
            }

            let controller = creep.room.controller;
            let container = controller.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        controller.pos.inRangeTo(structure.pos, 7);
                }
            }) as StructureContainer;

            if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                else if (creep.transfer(container, RESOURCE_ENERGY) == ERR_FULL) {
                    creep.transfer(container, RESOURCE_ENERGY, container.store.getFreeCapacity(RESOURCE_ENERGY));
                }
                return;
            }
        }
        // 取能量
        else {
            let storage = creep.room.storage;
            if (storage && storage.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                if (creep.withdraw(storage, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
                return;
            }

            let terminal = creep.room.terminal;
            if (terminal && terminal.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                if (creep.withdraw(terminal, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }
                return;
            }

            let resource = Game.getObjectById(creep.memory.task.resourceID) as Resource;
            if (!resource) {
                resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (resource) {
                    creep.memory.task.resourceID = resource.id;
                }
            }

            if (resource && resource.resourceType == RESOURCE_ENERGY) {
                if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource);
                }
                return;
            }

            let controller = creep.room.controller;
            let container = controller.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                return;
            }
        }

        return;
    }
};