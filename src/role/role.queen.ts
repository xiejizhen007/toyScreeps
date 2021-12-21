export const roleQueen = {
    /**
     * queen 专门送能量至 extension 和 spawn
     */
    run:function(creep : Creep) {
        if (!creep || creep.spawning) {
            return;
        }
        
        if ((creep.ticksToLive < 50 || creep.hits < creep.hitsMax) && creep.memory.isNeeded) {
            let room = Game.rooms[creep.memory.room];
            if (!room) {
                console.log('room does not exist: ' + creep.memory.room);
                return;
            }

            room.memory.spawnTasks.unshift({
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

        if (creep.ticksToLive < 30) {
            if (creep.room.storage) {
                creep.clearBody(creep.room.storage);
            }
        }

        // 送能量
        if (creep.memory.work) {
            let extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            }) as StructureExtension;

            if (extension) {
                if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extension);
                }
                else if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_FULL) {
                    creep.transfer(extension, RESOURCE_ENERGY, extension.store.getFreeCapacity(RESOURCE_ENERGY));
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
            if (terminal) {
                if (creep.withdraw(terminal, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }
                return;
            }

            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER
                        && structure.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity(RESOURCE_ENERGY);
                }
            }) as StructureContainer;

            if (container && container.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                if (creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                return;
            }
        }

        return;
    }
};