import { ROOM_TRANSFER_TASK, towerCheckEnergy, towerCheckStructure, towerEnergyLimit, TOWER_STATE } from "setting";

export default class TowerExtension extends StructureTower {
    public work(): void {
        if (this.store[RESOURCE_ENERGY] <= 100) { this.callEnergy(); }

        switch (this.room.memory.towerState) {
            case TOWER_STATE.DEFENSE_NPC:
                this.defenseNpc();
                break;
            case TOWER_STATE.DEFENSE_PLAYER:
                break;
            case TOWER_STATE.HEAL_CREEP:
                break;
            case TOWER_STATE.REPAIR_STRUCTURE:
                // break;
            default:
                this.normalTask();
        }
    }

    private checkEnermy(): boolean {
        if (Game.time % towerCheckEnergy != 0) { return false; }

        const enermys = this.room.find(FIND_HOSTILE_CREEPS);
        if (enermys.length > 0) {
            // this.room.memory.attackTarget = enermys[0].id;
            const energy = this.pos.findClosestByRange(enermys);
            this.room.memory.attackTarget = energy.id;            
            this.room.memory.towerState = TOWER_STATE.DEFENSE_NPC;
            return true;
        }

        return false;
    }

    private defenseNpc(): void {
        let target = Game.getObjectById<Creep>(this.room.memory.attackTarget);
        // 说明 npc 死了， 再找一遍，还没有就恢复正常
        if (!target) {
            const targets = this.room.find(FIND_HOSTILE_CREEPS);

            if (targets.length > 0) {
                target = this.pos.findClosestByRange(targets);
                this.room.memory.attackTarget = target.id;
            }
        }

        // 攻击
        if (target) {
            this.attack(target);
        }
        // 恢复正常
        else {
            delete this.room.memory.attackTarget;
            this.room.memory.towerState = TOWER_STATE.REPAIR_STRUCTURE;
        }
    }

    /**
     * 日常任务
     */
    private normalTask(): boolean {
        if (this.checkEnermy()) {}
        else if (this.repairStructure()) {}

        this.callEnergy(600);
        return false;
    }

    private repairStructure(): boolean {
        if (Game.time % towerCheckStructure != 0) { return false; }

        // let damagedStructure = Game.getObjectById<AnyStructure>(this.room.memory.damagedStructure);
        // // 这个建筑彻底坏了，或者是建筑满血了，重新找到目标
        // if (!damagedStructure || damagedStructure.hits == damagedStructure.hitsMax) {
        //     const damagedStructures = this.room.find(FIND_STRUCTURES, {
        //         filter: s => s.hits < s.hitsMax && 
        //             s.structureType != STRUCTURE_RAMPART && 
        //             s.structureType != STRUCTURE_WALL && 
        //             s.structureType != STRUCTURE_CONTAINER
        //     });

        //     if (damagedStructures.length > 0) {
        //         damagedStructure = this.pos.findClosestByRange(damagedStructures);
        //         this.room.memory.damagedStructure = damagedStructure.id;
        //     }
        //     else {
        //         delete this.room.memory.damagedStructure;
        //         return false;
        //     }
        // }

        // if (damagedStructure.hits + 400 < damagedStructure.hitsMax) {
        //     this.repair(damagedStructure);
        //     this.room.memory.damagedStructure = damagedStructure.id;
        //     return true;
        // }

        // return false;

        if (!this.room.memory.wallHit) {
            this.room.memory.wallHit = 10000;
        }

        let structures = this.room.find(FIND_STRUCTURES, {
            filter: s => s.hits != s.hitsMax && s.structureType != STRUCTURE_WALL 
                && s.structureType != STRUCTURE_RAMPART
        });

        if (structures.length > 0) {
            this.repair(structures[0]);
            return true;
        } else {
            structures = this.room.find(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL)
                    && s.hits < this.room.memory.wallHit
            });

            if (structures.length > 0) {
                this.repair(structures[0]);
                return true;
            } else {
                this.room.memory.wallHit += 10000;
            }
        }

        return false;
    }

    private callEnergy(energyLimit: number = 900): void {
        if (this.store[RESOURCE_ENERGY] <= towerEnergyLimit) {
            this.room.addTransferTask({
                type: ROOM_TRANSFER_TASK.FILL_TOWER,
                id: this.id,
            });
        }
    }
}