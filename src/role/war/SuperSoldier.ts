import { CREEP_STATE } from "setting";
import { Role } from "../role";

/**
 * boost 一体机
 */
export class SuperSoldier extends Role {
    // protected check(): void {
        
    // } 

    protected override prepare(): void {
        // boost first
        if (this.creep_.memory.boost) {
            this.creep_.boost();
        }        

        if (this.creep_.spawning) {
            return;
        }

        console.log('superSoldier move');

        let count = 0;
        this.creep_.body.forEach(f => {
            count += f.boost ? 1 : 0;
        });

        console.log('super: ' + count);

        // 全 boost 了
        if (count == this.creep_.body.length || this.creep_.memory.boost == undefined) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
        }
    }

    protected override target(): void {
        // const flag = Game.flags[this.creep_.memory.task.flagName];

        const flag = Game.flags[Memory.attackFlagQueue[0]];
        if (!flag) {
            console.log('create flag for super soldier: ' + this.creep_.id);
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

        let target = Game.getObjectById(this.creep_.memory.target as Id<AnyStructure> | Id<AnyCreep>);
        if (!target || target.hits == 0 || target.room.name != this.creep_.room.name) {
            // creep
            target = this.creep_.pos.findInRange(FIND_HOSTILE_CREEPS, 5, {
                filter: c => c.getActiveBodyparts(ATTACK) > 0 || 
                    c.getActiveBodyparts(RANGED_ATTACK) > 0
            })[0];

            // tower, spawn
            if (!target) {
                target = this.creep_.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => {
                        return s.structureType != STRUCTURE_TERMINAL && 
                            s.structureType != STRUCTURE_STORAGE &&
                            // !(s.structureType == STRUCTURE_WALL && s.hits == 1) &&
                            s.structureType != STRUCTURE_ROAD &&
                            s.structureType != STRUCTURE_CONTROLLER &&
                            s.structureType != STRUCTURE_WALL
                            // s.structureType != STRUCTURE_WALL
                    }
                });
            }

            if (target) {
                this.creep_.memory.target = target.id;
            } else {
                console.log('target clean');
                flag.remove();
                Memory.attackFlagQueue.shift();
            }
        }

        /**
         * TODO: 目标有可能在 rampart 里，尝试找到一个不在 rampart 里的打击对象
         * 如果找不到，就尽全力攻破某一个 rampart
         */

        if (target && target.hits > 0) {
            const terminal = this.creep_.room.terminal;
            const storage = this.creep_.room.storage;
            if (this.creep_.pos.inRangeTo(target, 3)) {
                if (this.creep_.getActiveBodyparts(RANGED_ATTACK) > 0) {
                    // // this.creep_.rangedAttack(target);
                    // this.creep_.rangedMassAttack();
                    // this.creep_.moveTo(target);
                    if ((storage && this.creep_.pos.inRangeTo(storage, 3)) || 
                        (terminal && this.creep_.pos.inRangeTo(terminal, 3))) {
                        this.creep_.rangedAttack(target);
                        this.creep_.moveTo(target);
                    } else {
                        this.creep_.rangedMassAttack();
                        this.creep_.moveTo(target);
                    }
                }
            } else {
                this.creep_.moveTo(target, {
                    maxRooms: 1
                });
            }
        }
   }
}