var roleTransferRoom = {
    /**
     * 外矿运输者
     * @param {Creep} creep 
     */
    run: function(creep) {
        if (creep.ticksToLive < 50 && creep.memory.isNeeded) {
            let room = Game.rooms[creep.memory.room];
            if (!room) {
                room = Game.spawns[creep.memory.spawn].room;
            }

            room.memory.missions.push({
                role: creep.memory.role, room: creep.memory.room, isNeeded: true,
                mission: creep.memory.mission
            });
            creep.memory.isNeeded = false;
            console.log('new mission by ' + creep.name);
        }
        

        if (creep.store.getFreeCapacity(RESOURCES_ALL) == 0) {
            creep.memory.transfer = true;
        }
        else if (creep.store.getCapacity(RESOURCES_ALL) - creep.store.getFreeCapacity(RESOURCES_ALL) == 0) {
            creep.memory.transfer = false;
        }

        // 送到 storage 
        if (creep.memory.transfer) {
            let room = Game.rooms[creep.memory.room];

            if (creep.room.name != room.name) {
                creep.moveTo(new RoomPosition(25, 25, room.name));
                return;
            }

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

            let terminal = room.terminal;
            if (terminal) {
                if (creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }
            }
        }
        // 拿能量
        else {
            // 前往房间
            if (creep.room.name != creep.memory.mission.workRoomName) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.mission.workRoomName));
                return;
            }
            
            let flag = Game.flags[creep.memory.mission.flagName];

            // 在挖矿的箱子下拿
            {
                let container = Game.getObjectById(creep.memory.mission.containerID);
                if (!container || !flag.pos.inRangeTo(container, 3)) {
                    container = flag.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTAINER;
                        }
                    });
                    if (container) {
                        creep.memory.mission.containerID = container.id;
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
                let resource = Game.getObjectById(creep.memory.mission.resourceID);
                if (!resource) {
                    resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                        filter: (dropResource) => {
                            return flag.pos.inRangeTo(dropResource.pos, 3);
                        }
                    });

                    if (resource) {
                        creep.memory.mission.resourceID = resource.id;
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

module.exports = roleTransferRoom;