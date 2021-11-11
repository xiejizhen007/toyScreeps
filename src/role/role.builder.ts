export const roleBuilder = {
    /**
     * 修建筑物，闲了去升级
     */
    run:function(creep : Creep) {
        if (!creep.memory.task.workRoomName) {
            creep.memory.task.workRoomName = creep.room.name;
        }

        if (creep.room.name != creep.memory.task.workRoomName) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.task.workRoomName));
            return;
        }

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.work = true;
        }
        else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.work = false;
        }

        if (creep.store[RESOURCE_LEMERGIUM] > 0) {
            let storage = creep.room.storage;
            if (storage) {
                if (creep.transfer(storage, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }

                return;
            }
        }

        if (creep.memory.work) {
            let building = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (building) {
                if ((creep.ticksToLive < 100) && creep.memory.isNeeded) {
                    let room = Game.rooms[creep.memory.room];
                    if (!room) {
                        return;
                    }

                    room.memory.spawnTasks.push({
                        role: creep.memory.role, room: creep.memory.room, isNeeded: true,
                        task: creep.memory.task
                    });
                    creep.memory.isNeeded = false;
                    console.log('new task by ' + creep.name);
                }

                if (creep.build(building) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(building);
                }

                return;
            }
        }
        // 取能量
        else {
            // let resource = Game.getObjectById(creep.memory.task.resourceID) as Resource;
            // if (!resource) {
            //     resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            //     if (resource) {
            //         creep.memory.task.resourceID = resource.id;
            //     }
            // }

            // if (resource) {
            //     if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(resource);
            //     }
            //     return;
            // }

            let workRoom = Game.rooms[creep.memory.task.workRoomName];
            let storage = workRoom.storage;
            if (storage && storage.store[RESOURCE_ENERGY] > 1000) {
                if (creep.withdraw(storage, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }

                return;
            }

            let terminal = workRoom.terminal;
            if (terminal && terminal.store[RESOURCE_ENERGY] > 1000) {
                if (creep.withdraw(terminal, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }

                return;
            }

            
            let container = Game.getObjectById(creep.memory.task.containerID) as StructureContainer;
            if (!container) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER;
                    }
                });

                if (container) {
                    creep.memory.task.containerID = container.id;
                }
            }
            
            if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                if (creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                return;
            }

            let source = Game.getObjectById(creep.memory.task.sourceID) as Source;
            if (!source) {
                source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (source) {
                    creep.memory.task.sourceID = source.id;
                }
            }

            if (source) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                return;
            }
        }
    }
};