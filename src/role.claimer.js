var roleClaimer = {
    /**
     * 预定房间
     * @param {Creep} creep 
     */
    run:function(creep) {
        if ((creep.ticksToLive < 100 || creep.hits != creep.hitsMax) && creep.memory.isNeeded) {
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

        let controller = creep.room.controller;
        let flag = Game.flags['claim'];

        if (flag) {
            if (!creep.pos.inRangeTo(flag.pos, 5)) {
                creep.moveTo(flag);
                return;
            }

            if (controller) {
                if (!creep.pos.inRangeTo(controller.pos, 1)) {
                    creep.moveTo(controller);
                    return;
                }

                let tmp = creep.claimController(controller);
                if (tmp == ERR_INVALID_TARGET && !controller.my) {
                    creep.attackController(controller);
                }
                return;
            }
        }

        if (controller) {
            if (creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        }
    }
};

module.exports = roleClaimer;