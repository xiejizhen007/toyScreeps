export const powerSpawnRun = function(room: Room) {
    if (room && room.controller.my && room.controller.level == 8) {
        let powerSpawn = Game.getObjectById<StructurePowerSpawn>(room.memory.powerSpawnID);
        if (!powerSpawn) {
            let powerSpawns = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_POWER_SPAWN;
                }
            });

            if (powerSpawns.length > 0) {
                powerSpawn = powerSpawns[0] as StructurePowerSpawn;
                room.memory.powerSpawnID = powerSpawn.id;
            }
        }

        if (!powerSpawn) { return; }

        if (powerSpawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 50 && powerSpawn.store.getUsedCapacity(RESOURCE_POWER) > 0) {
            powerSpawn.processPower();
        }
    }
}