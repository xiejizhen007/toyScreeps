export const creepPS = function(creep: Creep) {
    if (!creep || creep.spawning) {
        return;
    }
    
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
        console.log('new mission by ' + creep.name);
    }

    let powerSpawn = Game.getObjectById(creep.memory.powerSpawnID) as StructurePowerSpawn;
    if (!powerSpawn) {
        let powerSpawns = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_POWER_SPAWN;
            }
        });

        if (powerSpawns.length > 0) {
            powerSpawn = powerSpawns[0] as StructurePowerSpawn;
            creep.memory.powerSpawnID = powerSpawn.id;
        }
    }

    let terminal = creep.room.terminal;
    let storage = creep.room.storage;
    if (!terminal || !storage || !powerSpawn) { return; }
    if (storage.store.getUsedCapacity(RESOURCE_ENERGY) <= 10000 && terminal.store.getUsedCapacity(RESOURCE_ENERGY) <= 10000) { return; }
    
    let energyAmount = powerSpawn.store.getFreeCapacity(RESOURCE_ENERGY);
    let powerAmount = powerSpawn.store.getFreeCapacity(RESOURCE_POWER);

    if (creep.memory.work) {
        if (creep.pos.inRangeTo(powerSpawn, 1)) {
            for (let type in creep.store) {
                let resourceType = type as ResourceConstant;
                creep.transfer(powerSpawn, resourceType);
            }

            if (energyAmount > 0 || powerAmount > 0) {
                creep.memory.work = false;
            }
        }
        else {
            creep.moveTo(powerSpawn);
        }
    }
    else {
        if (creep.pos.inRangeTo(terminal, 1)) {
            let tmp = -1;
            if (powerAmount > 0 && (energyAmount / 50) < powerAmount) {
                let amount = powerAmount < creep.store.getFreeCapacity() ? powerAmount : creep.store.getFreeCapacity();
                if (terminal.store[RESOURCE_POWER] >= amount) { tmp = creep.withdraw(terminal, RESOURCE_POWER, amount); }
                else if (storage.store[RESOURCE_POWER] >= amount) { tmp = creep.withdraw(storage, RESOURCE_POWER, amount); }
            }
            else if (energyAmount > 0) {
                tmp = creep.withdraw(terminal, RESOURCE_ENERGY, energyAmount < creep.store.getFreeCapacity() ? energyAmount : creep.store.getFreeCapacity());
            }

            if (tmp == OK) {
                creep.memory.work = true;
            }
        }
        else {
            creep.moveTo(terminal);
        }
    }
}