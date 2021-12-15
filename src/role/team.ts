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

        let obj = Memory.pbTeam.find(f => {
            return f.attacker == this.creep_.name
        });

        let flag = Game.flags[obj.flagName];
        if (!flag) {
            console.log('pb team no flag!');
            return;
        }

        if (this.creep_.pos.inRangeTo(flag, 1)) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        } else {
            this.creep_.farGoTo(flag.pos);
        }
    }

    protected override target() {
        let obj = Memory.pbTeam.find(f => {
            return f.attacker == this.creep_.name
        });

        let flag = Game.flags[obj.flagName];
        let docter = Game.creeps[obj.docter];
        if (!docter) {
            console.log('pb team no docter');
            return;
        }

        let target = Game.getObjectById(this.creep_.memory.target as Id<StructurePowerBank>);
        if (!target) {
            target = flag.pos.findInRange(FIND_STRUCTURES, 1)[0] as StructurePowerBank;
            if (target) {
                this.creep_.memory.target = target.id;
            }
        }

        if (target && this.creep_.pos.isNearTo(docter) && this.creep_.hits >= this.creep_.hitsMax / 2) {
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

        let flag = Game.flags[this.obj.flagName];
        if (!flag) { return; }

        if (this.creep_.pos.inRangeTo(flag, 3)) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        } else {
            this.creep_.farGoTo(flag.pos);
        }
    }

    protected override target() {
        let attacker = Game.creeps[this.obj.attacker];
        if (!attacker) { return; }

        if (this.creep_.pos.isNearTo(attacker)) {
            this.creep_.heal(attacker);
        } else {
            this.creep_.goTo(attacker.pos);
        }
    }

    private obj = Memory.pbTeam.find(f => {
        return f.docter == this.creep_.name
    });
}

export class PBTransfer extends Role {
    protected override check() {

    }

    protected override prepare() {

    }

    protected override source() {

    }

    protected override target() {
        
    }
}