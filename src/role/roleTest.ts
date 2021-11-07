import { boostCreep } from "modules/boost";

export const testMan = function() {
    let creep = Game.creeps['test'];
    if (!creep || creep.spawning) { return; }

    if (creep.memory.boost) {
        const boostTask = creep.room.memory.boost;
        if (!boostTask) { return; }

        let flag = Game.flags[creep.room.name + 'Boost'];
        if (!flag) { 
            console.log('can not find boost flag');
            return;
        }

        // 先走到 boost 的旗子那里
        if (creep.pos.isEqualTo(flag)) {
            boostCreep(creep.room, creep);
        }
        else {
            creep.moveTo(flag);
        }
    }
}