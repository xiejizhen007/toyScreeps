export const roleHarvester = {
    /**
     * 专门挖矿 harvest，然后放入箱子 container 中
     */
    run:function(creep : Creep) {
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

        let flag = Game.flags[creep.memory.task.flagName];

        // 站在旗上，挖能量放到 container 中
        if (creep.pos.isEqualTo(flag.pos)) {
            let source = Game.getObjectById(creep.memory.task.sourceID) as Source;
            if (!source) {
                source = flag.pos.findClosestByRange(FIND_SOURCES, {
                    filter: (findSource) => {
                        return flag.pos.inRangeTo(findSource, 1);
                    }
                });
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
        // 不在旗子上
        else {
            creep.moveTo(flag);
            return;
        }

        return;
    }
};