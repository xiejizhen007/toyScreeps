import { CREEP_STATE,  } from "setting";
import { Role } from "./role";
// 小队

export class PBAttacker extends Role {
    /**
     * 检测到 pb 血量快到底，叫人来搬
     * 如果这条命打不完，根据 pb 的剩余时间继续派人来攻击
     */
    protected override check() {

    }

    protected override prepare() {
        if (this.creep_.spawning) { return; }
        if (this.creep_.memory.boost) {
            this.creep_.boost();
            return;
        }

        let flag = Game.flags[this.creep_.memory.task.flagName];
        if (!flag) {
            console.log('pb team no flag!');
            return;
        }

        if (this.creep_.pos.inRangeTo(flag, 1)) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        } else {
            // this.creep_.farGoTo(flag.pos);
            this.creep_.moveTo(flag, {
                reusePath: 50
            });
        }
    }

    protected override target() {
        let flag = Game.flags[this.creep_.memory.task.flagName];
        let target = Game.getObjectById(this.creep_.memory.target as Id<StructurePowerBank>);
        if (!target) {
            target = flag.pos.findInRange(FIND_STRUCTURES, 1)[0] as StructurePowerBank;
            if (target) {
                this.creep_.memory.target = target.id;
            }
        }

        if (target && this.creep_.hits > this.creep_.hitsMax / 2) {
            this.creep_.attack(target);
        }
    }
}

export class PBDocter extends Role {
    protected override check() {

    }

    protected override prepare() {
        if (this.creep_.spawning) { return; }
        if (this.creep_.memory.boost) {
            this.creep_.boost();
            return;
        }

        let flag = Game.flags[this.creep_.memory.task.flagName];
        if (!flag) { return; }

        if (this.creep_.pos.inRangeTo(flag, 3)) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        } else {
            // this.creep_.farGoTo(flag.pos);
            this.creep_.moveTo(flag, {
                reusePath: 50
            });
        }
    }

    protected override target() {
        let flag = Game.flags[this.creep_.memory.task.flagName];
        let attacker = Game.getObjectById(this.creep_.memory.target as Id<Creep>);
        if (!attacker) { 
            attacker = flag.pos.findInRange(FIND_MY_CREEPS, 3, {
                filter: c => {
                    return c.memory.role == 'pbAttacker' && 
                        c.memory.task.flagName == flag.name
                }
            })[0];
            if (attacker) {
                this.creep_.memory.target = attacker.id;
            } else {
                return; 
            }
        }

        if (attacker) {
            if (this.creep_.pos.isNearTo(attacker)) {
                this.creep_.heal(attacker);
            } else {
                this.creep_.goTo(attacker.pos);
            }
        }
    }
}

export class PBTransfer extends Role {
    protected override check() {

    }

    protected override prepare() {
        if (this.creep_.spawning) { 
            return; 
        }

        let flag = Game.flags[this.creep_.memory.task.flagName];
        if (!flag) {
            return;
        }

        if (this.creep_.pos.inRangeTo(flag, 4)) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
            this.source();
        } else {
            this.creep_.farGoTo(flag.pos);
        }
    }

    protected override source() {
        let target = this.creep_.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: d => {
                return d.resourceType == RESOURCE_POWER
            }
        })[0] as Resource;
        
        if (target && this.creep_.pickupFrom(target) == OK) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
        }
    }

    protected override target() {
        let room = Game.rooms[this.creep_.memory.room];
        if (this.creep_.room.name != room.name) {
            this.creep_.farGoTo(new RoomPosition(25, 25, room.name));
            return;
        }

        let storage = room.storage;
        if (storage && this.creep_.transferTo(storage, RESOURCE_POWER) == OK) {
            console.log(this.creep_.id + ' transfer power to storage, will suicide');
            // this.creep_.suicide();
        }
    }
}