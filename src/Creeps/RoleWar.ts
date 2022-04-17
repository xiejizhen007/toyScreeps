import { Role } from "./Role";

export interface RoleWarMemory extends CreepMemory {
    underAttack?: boolean;
}

export abstract class RoleWar extends Role {
    memory: RoleWarMemory;

    constructor(creep: Creep) {
        super(creep);
    }

    abstract init(): void;
    abstract work(): void;
    abstract finish(): void;

    get underAttack(): boolean {
        return this.memory.underAttack;
    }

    set underAttack(state: boolean) {
        this.memory.underAttack = state;
    }

    standbyTo(pos: RoomObject | RoomPosition, range: number = 1) {
        pos = pos instanceof RoomObject ? pos.pos : pos;

        if (this.pos.inRangeTo(pos, range)) {
            return true;
        } else {
            this.goto(pos);
            return false;
        }
    }
}