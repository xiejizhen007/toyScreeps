import { addSpawnTask } from "utils";

/**
 * 专门运外矿能量
 * 需要有旗子
 * @param creep 
 * @returns 
 */
export function transferRoom(creep: Creep) {
    // 还没出生
    if (!creep || creep.spawning) { return; }

    // 去到房间拿了就走
    // 初步思路，往回走的过程中，如果自己才装了不到一半，看看回来的路上有没有多余的能量可拿
    // 避着点 npc，同样，如果被打了，1500 tick 在复活
    
    let flag = Game.flags[creep.memory.task.flagName];
    if (!flag) { return; }

    if (creep.ticksToLive < 50 && creep.memory.isNeeded) { addSpawnTask(creep); }

    if (creep.store.getUsedCapacity() > 0) { creep.memory.work = true; }
    else if (creep.store.getUsedCapacity() == 0) { creep.memory.work = false; }

    // 往回送，送回家里的 storage 里
    if (creep.memory.work) {
        let room = Game.rooms[creep.memory.room];
        if (!room) {
            creep.say('no room');
            return;
        }

        let storage = room.storage;
        if (!storage) { return; }

        if (!creep.pos.inRangeTo(storage, 1)) {
            creep.farGoTo(storage.pos);
            return;
        }

        creep.transferTo(storage, RESOURCE_ENERGY);
    }
    // 去外矿，去外矿上的资源
    else {
        if (!creep.pos.inRangeTo(flag.pos, 1)) {
            creep.farGoTo(flag.pos);
            return;
        }

        let container = Game.getObjectById<StructureContainer>(creep.memory.task.containerID);
        if (!container) {
            container = flag.pos.lookFor(LOOK_STRUCTURES).find(
                s => s.structureType == STRUCTURE_CONTAINER) as StructureContainer;
            if (container) { creep.memory.task.containerID = container.id; }
        }

        if (container) { 
            let amount = creep.store.getFreeCapacity() < 
                container.store[RESOURCE_ENERGY] ?
                creep.store.getFreeCapacity() : container.store[RESOURCE_ENERGY];
            creep.say(amount.toString());
            creep.getEnergyFrom(container); 
            return;
        }

        let resource = flag.pos.lookFor(LOOK_RESOURCES).find(
            r => r.resourceType == RESOURCE_ENERGY);
        
        if (resource) { creep.pickup(resource); }
    }
}