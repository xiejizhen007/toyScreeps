export default class powerCreepExtension extends PowerCreep {
    public work(): void {
        if (this.enablePower()) { return; }
        if (this.keepAlive()) { return; }

        this.say('work');
        this.generateOps();
    }

    private keepAlive(): boolean {
        if (this.ticksToLive < 500) {
            // if (!this.room) { return false; }
            let powerSpawn = Game.getObjectById<StructurePowerSpawn>(this.room.memory.powerSpawnID);
            if (!powerSpawn) {
                let powerSpawns = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_POWER_SPAWN;
                    }
                });

                if (powerSpawns.length > 0) {
                    this.room.memory.powerSpawnID = powerSpawns[0].id;
                    powerSpawn = powerSpawns[0] as StructurePowerSpawn;
                }
            }
            
            if (!powerSpawn) { return false; }
            if (this.pos.inRangeTo(powerSpawn, 1)) {
                this.renew(powerSpawn);
            }
            else {
                this.moveTo(powerSpawn);
            }
            return true;
        }
    }

    private enablePower(): boolean {
        let controller = this.room.controller;
        if (controller && controller.my && !controller.isPowerEnabled) {
            if (this.pos.inRangeTo(controller, 1)) { this.enableRoom(controller); }
            else { this.moveTo(controller); }

            return true;
        }
        return false;
    }

    private generateOps(): void{
        this.usePower(PWR_GENERATE_OPS);
        let terminal = this.room.terminal;
        let storage = this.room.storage;

        if (!terminal && !storage) { return; }

        if (this.store.getFreeCapacity() < 50) {
            if (this.pos.inRangeTo(storage, 1)) { this.transfer(storage, RESOURCE_OPS); }
            else { this.moveTo(storage); }
        }
        else {
            this.moveTo(this.room.controller);
        }
    }
}