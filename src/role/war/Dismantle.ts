import { Role } from "role/role";
import { CREEP_STATE } from "setting";

export class SuperDismantle extends Role {
    protected check(): void {
        
    }

    protected prepare(): void {
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
        // const flag = Game.flags[this.creep_.memory.task.flagName];
        // const flag = Game.flags[Memory.attackFlagQueue[0]];
        const flag = Game.flags['dismantle'];
        if (!flag) {
            console.log('create flag for super dismantle: ' + this.creep_.id);
            return;
        }

        // heal 
        if (this.creep_.getActiveBodyparts(HEAL) > 0) {
            this.creep_.heal(this.creep_);
        }

        // 先去到目标房间
        if (this.creep_.room.name != flag.pos.roomName) {
            this.creep_.moveTo(flag, {
                reusePath: 20
            });
            return;
        }

        let target = Game.getObjectById(this.creep_.memory.target as Id<Structure>);
        if (!target || target.hits <= 0) {
            target = this.creep_.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                filter: s => {
                    return s.structureType == STRUCTURE_TOWER || 
                    // s.structureType == STRUCTURE_RAMPART ||
                    s.structureType == STRUCTURE_SPAWN ||
                    s.structureType == STRUCTURE_NUKER ||
                    s.structureType == STRUCTURE_LAB ||
                    s.structureType == STRUCTURE_EXTENSION
                }
            });

            // target = this.creep_.pos.findClosestByRange(targets);

            if (target) {
                this.creep_.memory.target = target.id;
            }
        }

        if (target && target.hits > 0) {
            if (this.creep_.pos.isNearTo(target)) {
                this.creep_.dismantle(target);
            } else {
                this.creep_.moveTo(target);
            }
        }
    }
}