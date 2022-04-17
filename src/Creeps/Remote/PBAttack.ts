import { RoleWar } from "Creeps/RoleWar";
import { DirectivePower } from "Directives/power";

export interface PBAttackMemory extends CreepMemory {
    friend?: string;        // 队友的 name
    finish?: boolean;       // 完成了当前的工作，即 power bank 炸了，或者消失了
}

export class PBAttack extends RoleWar {
    memory: PBAttackMemory;
    flag: DirectivePower;

    constructor(creep: Creep) {
        super(creep);
        this.flag = Kernel.directives[creep.memory.flag];
        if (this.flag) {
            this.flag.roles[this.name] = this;
        }
    }

    init(): void {
        if (this.flag) {
            this.standbyTo(this.flag.pos, 1);
        } 
    }

    work(): void {
        if (this.flag) {
            // 等 friend 奶自己，然后攻击
            if (this.pos.isNearTo(this.flag.pos)) {
                this.underAttack = true;

                const pb = this.flag.pos.lookFor(LOOK_STRUCTURES)[0] as StructurePowerBank;
                if (pb && this.getActiveBodyParts('attack') * 15 < this.hits) {
                    // 血量高于攻击 pb 反弹的伤害时就攻击 pb
                    this.attack(pb);
                    return;
                }

                const resource = this.flag.pos.lookFor(LOOK_RESOURCES)[0];
                if (resource) {
                    this.memory.finish = true;
                }
            }
        } else {
            this.memory.finish = true;
        }
    }

    finish(): void {
        if (this.memory.finish) {
            console.log('pb_attacker ' + this.name + ' finish his job');
            // this.suicide();
            return;
        }
    }
}