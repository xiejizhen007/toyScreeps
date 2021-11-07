export const roleTransfer = {
    /**
     * 运送 container 中的能量到 storage 去
     */
    run: function(creep : Creep) {
        if ((creep.ticksToLive < 50 || creep.hits < creep.hitsMax) && creep.memory.isNeeded) {
            let room = Game.rooms[creep.memory.room];
            if (!room) {
                console.log('room does not exist: ' + creep.memory.room);
                return;
            }

            room.memory.spawnTasks.push({
                role: creep.memory.role, room: creep.memory.room, isNeeded: true,
                task: creep.memory.task
            });
            creep.memory.isNeeded = false;
            console.log('new task by ' + creep.name);
        }
        

        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.work = true;
        }
        else if (creep.store.getCapacity() - creep.store.getFreeCapacity() == 0) {
            creep.memory.work = false;
        }

        // 送到 storage 
        if (creep.memory.work) {
            let room = Game.rooms[creep.memory.room];
            // console.log(creep.name + ' to :' + storage);
            
            let storage = room.storage;
            if (storage) {
                let tmp = creep.transfer(storage, RESOURCE_ENERGY);
                if (tmp == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
                else if (tmp == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.transfer(storage, RESOURCE_LEMERGIUM);
                }

                return;
            }

            let terminal = creep.room.terminal;
            if (terminal) {
                if (creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }
            }
        }
        // 拿能量
        else {
            if (creep.memory.task.workRoomName && creep.room.name != creep.memory.task.workRoomName) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.task.workRoomName));
                return;
            }

            let flag = Game.flags[creep.memory.task.flagName];

            // 在挖矿的箱子下拿
            {
                let container = Game.getObjectById(creep.memory.task.containerID) as StructureContainer;
                if (!container || !flag.pos.inRangeTo(container.pos, 3)) {
                    container = flag.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTAINER;
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
                    else if (creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_ENOUGH_ENERGY) {
                        creep.withdraw(container, RESOURCE_LEMERGIUM, creep.store.getFreeCapacity(RESOURCE_LEMERGIUM));
                    }
                    return;
                }
            }

            // 先捡掉出来的 resource
            {
                let resource = Game.getObjectById(creep.memory.task.resourceID) as Resource;
                if (!resource) {
                    resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                        filter: (dropResource) => {
                            return flag.pos.inRangeTo(dropResource.pos, 3);
                        }
                    });

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
            }

        }
    }
};