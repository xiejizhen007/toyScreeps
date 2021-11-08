export const roleKing = {
    /**
     * 
     */
    run: function(creep : Creep) {
        if (!creep || creep.spawning) {
            return;
        }

        if ((creep.ticksToLive < 50) && creep.memory.isNeeded) {
            let room = Game.rooms[creep.memory.room];
            if (!room) {
                return;
            }

            room.memory.spawnTasks.unshift({
                role: creep.memory.role, room: creep.memory.room, isNeeded: true,
                task: creep.memory.task
            });
            creep.memory.isNeeded = false;
            console.log('new task by ' + creep.name);
        }

        // 需要保证有旗
        let flag = Game.flags[creep.memory.task.flagName];
        if (!creep.pos.isEqualTo(flag.pos)) {
            creep.moveTo(flag.pos);
            return;
        }

        let storage = creep.room.storage;
        let terminal = creep.room.terminal;
        let controller = creep.room.controller;

        // controller 需要能量了，放到 link 传过去
        // storage 没能量了，把 terminal 的能量放进去，然后买
        // terminal 需要买东西，没能量了，把 storage 的能量放进去
        let linkController = Game.getObjectById(creep.memory.linkControllerID) as StructureLink;
        if (!linkController && controller) {
            linkController = controller.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LINK;
                }
            });

            if (linkController) {
                creep.memory.linkControllerID = linkController.id;
            }
        }

        let containerController = Game.getObjectById(creep.memory.containerControllerID) as StructureLink;
        if (!containerController && controller) {
            containerController = controller.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        controller.pos.inRangeTo(structure.pos, 5);
                }
            });

            if (containerController) {
                creep.memory.containerControllerID = containerController.id;
            }
        }

        let linkCenter = Game.getObjectById(creep.memory.linkCenterID) as StructureLink;
        if (!linkCenter) {
            linkCenter = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LINK;
                }
            });
            
            if (linkCenter) {
                creep.memory.linkCenterID = linkCenter.id;
            }
        }

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.work = true;
        }
        else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.work = false;
        }

        if (storage && terminal) {
            if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) >= 100000) {
                if (creep.memory.work) {
                    creep.transfer(storage, RESOURCE_ENERGY);
                }
                else {
                    creep.withdraw(terminal, RESOURCE_ENERGY);
                }
            }
            else if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) <= 50000) {
                if (creep.memory.work) {
                    creep.transfer(terminal, RESOURCE_ENERGY);
                }
                else {
                    creep.withdraw(storage, RESOURCE_ENERGY);
                }
            }

            return;
        }

        if (containerController && linkCenter && linkController) {
            if (containerController.store.getFreeCapacity(RESOURCE_ENERGY) >= 1200) {
                if (creep.memory.work) {
                    creep.transfer(linkCenter, RESOURCE_ENERGY);
                }
                else {
                    creep.withdraw(storage, RESOURCE_ENERGY);
                }

                if (linkCenter.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && linkCenter.cooldown == 0) {
                    linkCenter.transferEnergy(linkController);
                }

                return;
            }
        }

    }
};