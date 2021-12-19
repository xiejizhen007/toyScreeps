import { PC_TASK } from "setting";

export default class powerCreepExtension extends PowerCreep {
    public work(): void {
        if (!this || !this.hits) { return; }

        if (this.enablePower()) { return; }
        if (this.keepAlive()) { return; }

        this.say('work');
        this.generateOps();
        this.regenSource();
        this.operatePower();
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

    private generateOps(): void {
        this.usePower(PWR_GENERATE_OPS);
        let terminal = this.room.terminal;
        let storage = this.room.storage;

        if (!terminal && !storage) { return; }

        if (this.store.getFreeCapacity() < 50) {
            if (this.pos.inRangeTo(storage, 1)) { this.transfer(storage, RESOURCE_OPS); }
            else { this.moveTo(storage); }
        }
        // else {
        //     this.moveTo(this.room.controller);
        // }
    }

    private regenSource():void {
        if (!this.room.memory.powerTask) { return; }
        let task = this.room.memory.powerTask[0];
        if (!task || task.type != PC_TASK.REGEN_SOURCE) { return; }

        const source = Game.getObjectById<Source>(task.id);
        if (!source) { return; }

        if (this.pos.inRangeTo(source, 3)) {
            const tmp = this.usePower(PWR_REGEN_SOURCE, source);
            if (tmp == OK) {
                this.room.removePowerTask();
            }
        }   
        else { this.moveTo(source); }
    }

    private operatePower(): void {
        let task = this.room.memory.powerTask[0];
        if (!task || task.type != PC_TASK.OPERATE_POWER) { return; }

        const target = Game.getObjectById(this.room.memory.powerSpawnID as Id<StructurePowerSpawn>);
        if (this.store[RESOURCE_OPS] >= 200) {
            if (this.pos.inRangeTo(target.pos, 3)) {
                this.usePower(PWR_OPERATE_POWER, target);
                this.room.removePowerTask();
            } else {
                this.moveTo(target);
            }
        } else {
            if (this.pos.inRangeTo(this.room.storage, 1)) {
                this.withdraw(this.room.storage, RESOURCE_OPS, 200);
            } else {
                this.moveTo(this.room.storage);
            }
        }
    }
}