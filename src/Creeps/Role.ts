export abstract class Role {
    creep: Creep;

    constructor(name: string) {
        this.creep = Game.creeps[name];
    }

    abstract init(): void;
    abstract work(): void;
}