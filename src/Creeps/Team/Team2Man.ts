import { Role } from "Creeps/Role";

export interface Team2ManMemory {
    id: number; 
}

export class Team2Man {
    static id: number;
    memory: Team2ManMemory;
    roles: Role[];

    constructor(role0: Role, role1: Role) {
        this.roles = [];
        this.roles.push(role0);
        this.roles.push(role1);
    }

    init(): void {}
    work(): void {}
    finish(): void {}

    static create(): number {
        this.id = Game.time;
        return this.id;
    }
}