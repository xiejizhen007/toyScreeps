import { addRoleSpawnTask, addSpawnTask, callReserver, removeReserverRoom } from "utils";

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

    // const reservation = creep.room.controller.reservation;

    // 预定点数掉到 0 了，派一个预定者
    // 是不是已经有预定者了，没有再添加添加
    if (creep.room.controller && !creep.room.controller.reservation) {
        if (callReserver(creep)) { console.log('call reserver'); }
        // addRoleSpawnTask('reserver', creep.memory.room, creep.room.name);
    }
    else if (creep.room.controller && creep.room.controller.reservation) {
        removeReserverRoom(creep.room.name);
    }
    // 刷 npc 了，等 1500 tick 后重生，继续干活，（把 npc 耗死掉）

    // 有 npc 核心，记录消失时间，等到 npc core 消失才叫人去挖外矿
    // 或者是派遣一个攻击的，把 core 给打了
    // 暂定离家近的话，给他打了，远的话就先停下
    if (creep.room.controller && creep.room.controller.reservation && creep.room.controller.reservation.username == 'Invader') {
        let core = creep.room.find(FIND_STRUCTURES).find(s => s.structureType == STRUCTURE_INVADER_CORE);
        if (core) {
            // console.log(core.effects[0].ticksRemaining);
        }
    }

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

    // 快死了，把身上的能量放到 container 里
    if (creep.ticksToLive <= 5) { creep.drop(RESOURCE_ENERGY); }

    if (newContainer) { creep.build(newContainer); }
    else if (container && container.hits < container.hitsMax) { creep.repair(container); }

    return;
}