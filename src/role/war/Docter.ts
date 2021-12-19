import { Role } from "role/role";
import { CREEP_STATE } from "setting";

export class superDocter extends Role {
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

        console.log('superSoldier move');

        let count = 0;
        this.creep_.body.forEach(f => {
            count += f.boost ? 1 : 0;
        });

        // 全 boost 了
        if (count == this.creep_.body.length || this.creep_.memory.boost == undefined) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
        }
    }

    protected target(): void {
        if (this.creep_.getActiveBodyparts(HEAL) > 0) {
            this.creep_.heal(this.creep_);
        }

        const flag = Game.flags[Memory.attackFlagQueue[0]];
        if (!flag) {
            console.log('create flag for super docter: ' + this.creep_.id);
            return;
        }

        let target = Game.getObjectById(this.creep_.memory.target as Id<Creep>);
        if (!target) {
            target = flag.pos.findInRange(FIND_MY_CREEPS, 5, {
                filter: c => c.memory.role && c.memory.role == 'superDismantle'
            })[0];

            if (target) {
                this.creep_.memory.target = target.id;
            }
        }

        if (target) {
            if (this.creep_.pos.isNearTo(target)) {
                this.creep_.heal(target);
            } else {
                this.creep_.moveTo(target);
            }
        }
    }
}