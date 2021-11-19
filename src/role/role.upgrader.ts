export const roleUpgrader = {
    /**
     * 在附近的 container 里边拿能量升级 controller
     */
    run: function(creep : Creep) {
        // console.log(_.filter(creep.room.getEventLog(), {objectId: creep.id})[0].event);
        if ((creep.ticksToLive < 50 || creep.hits < creep.hitsMax) && creep.memory.isNeeded) {
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

        if (creep.memory.work) {
            let controller = creep.room.controller;
            if (controller) {
                if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            }
        }
        // 取能量
        else {
            let controller = creep.room.controller;
            let container = Game.getObjectById(creep.memory.task.containerID) as StructureContainer;

            if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && container.pos.inRangeTo(controller, 4)) {
                if (creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                else if (creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_ENOUGH_ENERGY) {
                    creep.withdraw(container, RESOURCE_ENERGY, container.store[RESOURCE_ENERGY]);
                    creep.memory.work = true;
                }
                return;
            }

            let linkController = Game.getObjectById(creep.memory.task.linkID) as StructureLink;
            if (!linkController) {
                linkController = controller.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_LINK &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
                });

                if (linkController) {
                    creep.memory.task.linkID = linkController.id;
                }
            }

            if (linkController && linkController.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(linkController, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(linkController);
                }
                else if (creep.withdraw(linkController, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_ENOUGH_ENERGY) {
                    creep.withdraw(linkController, RESOURCE_ENERGY, linkController.store[RESOURCE_ENERGY]);
                    creep.memory.work = true;
                }
                return;
            }

            if (!container || !container.pos.inRangeTo(controller.pos, 4)) {
                container = controller.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER 
                            && structure.store[RESOURCE_ENERGY] > 0
                            && controller.pos.inRangeTo(structure, 4);
                    }
                });
                
                if (container) {
                    creep.memory.task.containerID = container.id;
                }
            }


            let storage = creep.room.storage;
            if (storage && storage.store[RESOURCE_ENERGY] > 2000) {
                if (creep.withdraw(storage, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }

                return;
            }

            let resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            // console.log(resource);
            if (resource && resource.resourceType == RESOURCE_ENERGY) {
                if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource);
                }

                return;
            }

            let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (source) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }

        return;
    }
};