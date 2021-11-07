var roleHarvesterRoom = {
    /**
     * 专门挖外矿 harvest，然后放入箱子 container 中
     * @param {Creep} creep 
     */
    run:function(creep) {
        if (creep.spawning) {
            return;
        }

        if (creep.ticksToLive < 50 && creep.memory.isNeeded) {
            let room = Game.rooms[creep.memory.room];

            room.memory.missions.push({
                role: creep.memory.role, room: creep.memory.room, isNeeded: true,
                mission: creep.memory.mission
            });
            creep.memory.isNeeded = false;
            console.log('new mission by ' + creep.name);
        }

        // 先去到工作房间
        if (creep.room.name != creep.memory.mission.workRoomName) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.mission.workRoomName));
            return;
        }

        let flag = Game.flags[creep.memory.mission.flagName];

        // 站在旗上，挖能量放到 container 中
        if (creep.pos.isEqualTo(flag.pos)) {
            let source = Game.getObjectById(creep.memory.mission.sourceID);
            if (!source) {
                source = flag.pos.findClosestByRange(FIND_SOURCES);
                if (source) {
                    creep.memory.mission.sourceID = source.id;
                }
            }

            let container = Game.getObjectById(creep.memory.mission.containerID);
            if (!container) {
                container = flag.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER
                            && flag.pos.inRangeTo(structure.pos, 1);
                    }
                });

                if (!container) {
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
                    container = flag.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTAINER
                                && flag.pos.inRangeTo(structure.pos, 1);
                        }
                    });
                }
            }
            
            // constructction site
            if (container.progress != undefined) {
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= creep.store.getCapacity(RESOURCE_ENERGY) / 4 || source.energy == 0) {
                    creep.build(container);
                    return;
                } 
            }

            creep.harvest(source);
        }
        // 不在旗子上
        else {
            creep.moveTo(flag);
            return;
        }

        return;
    }
};

module.exports = roleHarvesterRoom;