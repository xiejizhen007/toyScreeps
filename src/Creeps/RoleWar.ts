import { Role } from "./Role";

export interface RoleWarMemory extends CreepMemory {
    underAttack?: boolean;
}

export abstract class RoleWar extends Role {
    memory: RoleWarMemory;
    flag: Flag;

    constructor(creep: Creep, flag: Flag) {
        super(creep);
        this.flag = flag;
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
}