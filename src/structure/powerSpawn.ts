import { ROOM_TRANSFER_TASK } from "setting";

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

export default class PowerSpawnExtension extends StructurePowerSpawn {
    public generatePower(): void {
        if (this.store[RESOURCE_POWER] >= 1 && this.store[RESOURCE_ENERGY] >= 50) {
            this.processPower();
        }
        else {
            console.log('powerSpawn call resource');
            const resourceType = this.store[RESOURCE_POWER] < this.store[RESOURCE_ENERGY] / 50 ? RESOURCE_POWER : RESOURCE_ENERGY;
            this.callResource(resourceType);
        }
    }

    private callResource(resourceType: ResourceConstant): void {
        this.room.addTransferTask({
            type: ROOM_TRANSFER_TASK.FILL_POWERSPAWN,
            id: this.id,
            resourceType: resourceType
        });
    }
}