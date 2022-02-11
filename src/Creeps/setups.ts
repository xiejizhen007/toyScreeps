import { CreepSetup } from "./CreepSetup";

export const Roles = {
    queen: 'queen',
    king: 'king',
    manager: 'manager',
    worker: 'worker',
    harvester: 'harvester',
    upgrader: 'upgrader',
};

export enum RolePriority {
    king,
    queen,
    worker,
    harvester,
};

export const Setups = {

    queen: {
        default: new CreepSetup(Roles.queen, {
            body: [CARRY, MOVE],
            limit: Infinity,
        }),

        advanced: new CreepSetup(Roles.queen, {
            body: [CARRY, CARRY, MOVE],
            limit: Infinity,
        }),
    },

    king: {

    },

    worker: {
        default: new CreepSetup(Roles.worker, {
            body: [WORK, CARRY, MOVE, MOVE],
            limit: Infinity,
            ordered: false,
        }),

        advanced: new CreepSetup(Roles.worker, {
            body: [WORK, CARRY, MOVE],
            limit: Infinity,
            ordered: false,
        }),
    },

    harvester: {
        default: new CreepSetup(Roles.harvester, {
            body: [WORK, CARRY, MOVE],
            limit: 6,
            ordered: false,
        }),
    },

    upgrader: {
        default: new CreepSetup(Roles.upgrader, {
            body: [WORK, CARRY, MOVE, MOVE],
            limit: 5,
            ordered: false,
        }),
    }
};