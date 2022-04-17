import { RoleWar } from "Creeps/RoleWar";
import { DirectivePower } from "Directives/power";
import { PBAttack } from "./PBAttack";

export interface PBAttackMemory extends CreepMemory {
    friend?: string;        // 队友的 name
    finish?: boolean;       // 完成了当前的工作，即 power bank 炸了，或者消失了
}

export class PBHeal extends RoleWar {
    memory: PBAttackMemory;
    flag: DirectivePower;
    friend: PBAttack;

    constructor(creep: Creep) {
        super(creep);
        this.flag = Kernel.directives[creep.memory.flag];
        if (this.flag) {
            this.flag.roles[this.name] = this;
        }
        this.friend = undefined;
    }

    init(): void {
        if (this.flag) {
            this.standbyTo(this.flag.pos, 3);
            this.friend = Kernel.roles[this.memory.friend];

            if (!this.friend) {
                for (const name in this.flag.roles) {
                    console.log('flag\' role name: ' + name);
                    const role = this.flag.roles[name] as PBAttack;
                    if (role && role.memory.role == 'pb_attack' && !Game.creeps[role.memory.friend]) {
                        this.memory.friend = role.name;
                        console.log('应该有搭档才对');
                    }
                }

                console.log('heal no friend');
            } else {
                this.friend.memory.friend = this.name;
                console.log('heal have a friend');
            }
        }

        if (this.hits != this.hitsMax) {
            this.underAttack = true;
        }
    }

    work(): void {
        if (this.underAttack) {
            this.heal(this.creep);
            return;
        }

        if (this.friend) {
            if (this.heal(this.friend.creep) == ERR_NOT_IN_RANGE) {
                this.goto(this.friend.pos);
            }
        }
    }

    finish(): void {
        if (this.memory.finish) {
            console.log('pb_healer ' + this.name + ' finish his job');
            return;
        }
    }
}