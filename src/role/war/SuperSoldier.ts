import { CREEP_STATE } from "setting";
import { Role } from "../role";

/**
 * boost 一体机
 */
export class SuperSoldier extends Role {
    protected check(): void {
        
    } 

    protected prepare(): void {
        // boost first
        if (this.creep_.memory.boost) {
            this.creep_.boost();
        }        

        if (this.creep_.spawning) {
            return;
        }

        let count = 0;
        this.creep_.body.forEach(f => {
            count += f.boost ? 1 : 0;
        });

        // 全 boost 了
        if (count == this.creep_.body.length) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
        }
    }

    protected target(): void {
        const flag = Game.flags[this.creep_.memory.task.flagName];
        if (!flag) {
            console.log('create flag for super soldier: ' + this.creep_.id);
            return;
        }

        // heal 
        if (this.creep_.hits < this.creep_.hitsMax && this.creep_.getActiveBodyparts(HEAL) > 0) {
            this.creep_.heal(this.creep_);
        }

        // 先去到目标房间
        if (this.creep_.room.name != flag.pos.roomName) {
            this.creep_.moveTo(flag, {
                reusePath: 20
            });
            return;
        }

        let target = Game.getObjectById(this.creep_.memory.target as Id<AnyStructure> | Id<AnyCreep>);
        if (!target || target.hits == 0) {
            // creep
            target = this.creep_.pos.findInRange(FIND_HOSTILE_CREEPS, 5, {
                filter: c => c.getActiveBodyparts(ATTACK) > 0 || 
                    c.getActiveBodyparts(RANGED_ATTACK) > 0
            })[0];

            // tower, spawn
            if (!target) {
                target = flag.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: s => s.structureType == STRUCTURE_TOWER ||
                        s.structureType == STRUCTURE_SPAWN
                })[0];
            }

            if (target) {
                this.creep_.memory.target = target.id;
            }
        }

        if (target && target.hits > 0) {
            if (this.creep_.pos.inRangeTo(target, 3)) {
                if (this.creep_.getActiveBodyparts(RANGED_ATTACK) > 0) {
                    this.creep_.rangedAttack(target);
                }
            } else {
                this.creep_.moveTo(target);
            }
        }
   }
}