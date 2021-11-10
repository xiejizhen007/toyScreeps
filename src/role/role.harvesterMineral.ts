export const roleHarvesterMineral = {
    /**
     * 专门挖矿 harvest，然后放入箱子 container 中
     * @param {Creep} creep 
     */
    run:function(creep) {
        if ((creep.ticksToLive < 50 || creep.hits < creep.hitsMax) && creep.memory.isNeeded) {
            let room = Game.rooms[creep.memory.room];
            if (!room) {
                room = Game.spawns[creep.memory.spawn].room;
            }

            room.memory.spawnTasks.push({
                role: creep.memory.role, room: creep.memory.room, isNeeded: true,
                task: creep.memory.task,
            });
            creep.memory.isNeeded = false;
            console.log('new task by ' + creep.name);
        }

        // 先去到工作房间
        if (creep.room.name != creep.memory.task.workRoomName) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.task.workRoomName));
            return;
        }

        if (creep.memory.back) {
            let storage = creep.room.storage;
            if (storage) {
                if (!creep.pos.inRangeTo(storage.pos, 1)) {
                    creep.moveTo(storage);
                    return;
                }

                for (let type in creep.store) {
                    creep.transfer(storage, type);
                }

                if (creep.store.getUsedCapacity() == 0) {
                    creep.memory.back = false;
                } 
                return;
            }
        }
        else {
            let mineral = Game.getObjectById<Mineral>(creep.memory.task.mineralID);
            if (!mineral) {
                mineral = creep.pos.findClosestByRange(FIND_MINERALS);

                if (mineral) {
                    creep.memory.task.mineralID = mineral.id;
                }
            }

            if (mineral) {
                if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineral);
                }
            }


            if (creep.store.getFreeCapacity(RESOURCES_ALL) == 0) {
                creep.memory.back = true;
            }
        }
    }
};