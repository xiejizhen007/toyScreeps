import { Role } from "role/role";
import { CREEP_STATE } from "setting";

// TODO: 检查建筑工地，刷墙
export class Worker extends Role {
    protected check(): void {
        if (this.creep_.memory.isNeeded && this.creep_.ticksToLive < 50) {
            this.creep_.room.addSpawnTask(this.creep_);
            this.creep_.memory.isNeeded = false;
        }
    }

    protected prepare(): void {
        if (this.creep_.spawning) {
            return;
        }        

        this.creep_.memory.state = CREEP_STATE.SOURCE;
    }

    protected source(): void {
        const terminal = this.creep_.room.terminal;
        if (terminal) {
            this.creep_.withdrawFrom(terminal, RESOURCE_ENERGY);
        }        

        if (this.creep_.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        }
    }

    protected target(): void {
        // let target
        if (this.creep_.store[RESOURCE_ENERGY] == 0) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
            this.source();
            return;
        }

        const nowWallHits = this.creep_.room.memory.wallHit;

        let target = Game.getObjectById(this.creep_.memory.target as Id<Structure>);
        if (!target || target.hits > nowWallHits) {
            target = this.creep_.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_WALL ||
                    s.structureType == STRUCTURE_RAMPART) && 
                    s.hits < nowWallHits
            });

            if (target) {
                this.creep_.memory.target = target.id;
            } else {
                this.creep_.room.memory.wallHit += 10000;
            }
        }

        if (target) {
            if (this.creep_.pos.inRangeTo(target, 3)) {
                this.creep_.repair(target);
            } else {
                this.creep_.moveTo(target);
            }
        }
    }
}