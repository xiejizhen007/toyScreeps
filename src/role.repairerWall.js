var roleRepairerWall = {
    /**
     * 
     * @param {Creep} creep 
     */
    run: function(creep) {
        if (creep.spawning) {
            return;
        }
        
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.repair = true;
        } else if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repair = false;
        }

        if (creep.memory.repair) {
            let hits = 200000;
            let wall = Game.getObjectById(creep.memory.mission.wallID);
            if (!wall || wall.hits >= hits) {
                wall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_WALL &&
                            structure.hits < hits;
                    }
                });

                if (wall) {
                    creep.memory.mission.wallID = wall.id;
                }
            }    
            
            if (wall) {
                if ((creep.ticksToLive < 50) && creep.memory.isNeeded) {
                    // Memory.missions.push({
                    //     role: creep.memory.role, spawn: creep.memory.spawn, isNeeded: true,
                    //     mission: creep.memory.mission
                    // });
                    let room = Game.rooms[creep.memory.room];
                    if (!room) {
                        return;
                    }

                    room.memory.missions.push({
                        role: 'repairerWall', room: creep.memory.room, isNeeded: true, mission: creep.memory.mission
                    });
                    creep.memory.isNeeded = false;
                    console.log('new mission by ' + creep.name);
                }

                if (creep.repair(wall) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wall);
                }
                return;
            }
        }
        else {
            let target = creep.room.storage;

            if (target && target.store[RESOURCE_ENERGY] >= 1000) {
                if (creep.withdraw(target, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }

            target = creep.room.terminal;
            if (target && target.store[RESOURCE_ENERGY] >= 1000) {
                if (creep.withdraw(target, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }
        }
    }
};

module.exports = roleRepairerWall;