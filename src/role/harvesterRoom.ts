import { addRoleSpawnTask, addSpawnTask } from "utils";

export function harvesterRoom(creep: Creep) {
    // 没能力干活
    if (!creep || creep.spawning) { return; }

    // prepare 
    let flag = Game.flags[creep.memory.task.flagName];
    if (!flag) {
        console.log('插旗给：' + creep.id);
        return;
    }

    // 前往指定位置
    if (!creep.pos.isEqualTo(flag.pos)) {
        creep.farGoTo(flag.pos);
        return;
    }

    // 重生任务
    if (creep.ticksToLive <= 50 && creep.memory.isNeeded) {
        addSpawnTask(creep);
    }

    // 预定点数掉到 0 了，派一个预定者
    if (creep.room.controller && !creep.room.controller.reservation) {
        // addRoleSpawnTask('reserver', creep.memory.room, creep.room.name);
        // console.log('call reserver');
    }

    // 刷 npc 了，等 1500 tick 后重生，继续干活，（把 npc 耗死掉）

    // 有 npc 核心，记录消失时间，等到 npc core 消失才叫人去挖外矿

    // 到达指定位置之后就开始挖能量
    // 检查脚下的箱子，没事就修一下
    let target = Game.getObjectById<Source>(creep.memory.task.sourceID);
    let container = Game.getObjectById<StructureContainer>(creep.memory.task.containerID);
    let newContainer = Game.getObjectById<ConstructionSite>(creep.memory.task.constructionSiteID);

    if (!target) {
        target = flag.pos.findClosestByRange(FIND_SOURCES);
        if (target) { creep.memory.task.sourceID = target.id; }
    }

    if (!container) {
        container = flag.pos.lookFor(LOOK_STRUCTURES).find(s => s.structureType == STRUCTURE_CONTAINER) as StructureContainer;
        if (container) { creep.memory.task.containerID = container.id; }
        else { creep.room.createConstructionSite(flag.pos, STRUCTURE_CONTAINER); }
    }

    if (!newContainer && !container) {
        newContainer = flag.pos.lookFor(LOOK_CONSTRUCTION_SITES).find(s => s.structureType == STRUCTURE_CONTAINER);
        if (newContainer) { creep.memory.task.constructionSiteID = newContainer.id; }
    }

    // 开始挖能量
    creep.getEnergyFrom(target);

    if (newContainer) { creep.build(newContainer); }
    else if (container && container.hits < container.hitsMax) { creep.repair(container); }

    return;
}