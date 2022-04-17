import { Role } from "Creeps/Role";

export interface Team2ManMemory {
    id: number; 
}

export class Team2Man {
    static id: number;
    memory: Team2ManMemory;
    role0: Role;
    role1: Role;

    constructor(role0: Role, role1: Role) {
        this.role0 = role0;
        this.role1 = role1;
    }

    init(): void {}
    work(): void {}
    finish(): void {}

    static create(): number {
        this.id = Game.time;
        return this.id;
    }
}