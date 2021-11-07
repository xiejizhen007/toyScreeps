export const roleRepairer = {
    /**
     * 修箱子，空闲之后帮忙升级
     */
    run: function(creep : Creep) {
        if ((creep.ticksToLive < 50) && creep.memory.isNeeded) {
            let room = Game.rooms[creep.memory.room];
            if (!room) {
                return;
            }

            room.memory.spawnTasks.push({
                role: creep.memory.role, room: creep.memory.room, isNeeded: true,
                task: creep.memory.task
            });
            // Memory.tasks.push({
            //     role: creep.memory.role, spawn: creep.memory.spawn, isNeeded: true,
            //     task: creep.memory.mission
            // });
            creep.memory.isNeeded = false;
            console.log('new task by ' + creep.name);
        }

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.work = true;
        } else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.work = false;
        }

        if (creep.memory.work) {
            if (creep.room.name != creep.memory.task.workRoomName) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.task.workRoomName));
                return;
            }

            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.hits < structure.hitsMax;
                }
            });

            if (target) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }

            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_ROAD &&
                        structure.hitsMax - structure.hits >= 800;
                }
            });

            if (target) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

                return;
            }
        }
        else {
            if (creep.room.name != creep.memory.task.workRoomName) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.task.workRoomName));
                return;
            }

            let storage = Game.rooms[creep.memory.task.workRoomName].storage;
            if (storage) {
                if (creep.withdraw(storage, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
                return;
            }

            // 待优化，当前思路，每过一段 ticks 就重新找，因为有可能当前的 container 或者 storage 在建设中
            // id
            let container = Game.getObjectById(creep.memory.task.containerID) as StructureContainer;
            if (!container) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity(RESOURCE_ENERGY);
                    }
                });

                if (container) {
                    creep.memory.task.containerID = container.id;
                }
            }
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                return;
            }

            let resource = Game.getObjectById(creep.memory.task.resourceID) as Resource;
            if (!resource) {
                resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (resource) {
                    creep.memory.task.resourceID = resource.id;
                }
            }

            if (resource) {
                if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource);
                }
                return;
            }

            return;
        }

        return;
    }
};