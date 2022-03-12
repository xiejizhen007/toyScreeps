import { CreepSetup } from "./CreepSetup";

export const Roles = {
    queen: 'queen',
    king: 'king',
    manager: 'manager',
    worker: 'worker',
    harvester: 'harvester',
    upgrader: 'upgrader',
    miner: 'miner',
    transfer: 'transfer',

    claimer: 'claimer',
    pionner: 'pioneer',
    test: 'test',
};

export enum RolePriority {
    king,
    queen,
    harvester,
    worker,
    miner,
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
        default: new CreepSetup(Roles.king, {
            body: [CARRY, CARRY, CARRY, CARRY, MOVE],
            limit: 4,
        }),
    },

    worker: {
        default: new CreepSetup(Roles.worker, {
            body: [WORK, CARRY, MOVE, MOVE],
            limit: 8,
            ordered: false,
        }),

        advanced: new CreepSetup(Roles.worker, {
            body: [WORK, CARRY, MOVE],
            limit: 8,
            ordered: false,
        }),
    },

    harvester: {
        default: new CreepSetup(Roles.harvester, {
            body: [WORK, WORK, CARRY, MOVE],
            limit: 5,
            ordered: false,
        }),
    },

    upgrader: {
        default: new CreepSetup(Roles.upgrader, {
            body: [WORK, CARRY, MOVE, MOVE],
            limit: 5,
            ordered: false,
        }),

        advanced: new CreepSetup(Roles.upgrader, {
            body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
            limit: 5,
            ordered: false
        }),
    },

    miner: {
        default: new CreepSetup(Roles.miner, {
            body: [WORK, WORK, WORK, WORK, CARRY, MOVE],
            limit: Infinity,
            ordered: false
        }),
    },

    transfer: {
        default: new CreepSetup(Roles.transfer, {
            body: [CARRY, MOVE],
            limit: Infinity,
            ordered: false
        }),
    },

    // remote 
    claimer: {
        default: new CreepSetup(Roles.claimer, {
            body: [CLAIM, MOVE],
            limit: 1,
            ordered: false
        }),
    },

    pioneer: {
        default: new CreepSetup(Roles.pionner, {
            body: [WORK, CARRY, MOVE, MOVE],
            limit: 12,
            ordered: false
        }),
    },

    // test
    test: {
        default: new CreepSetup(Roles.test, {
            body: [CARRY, MOVE],
            limit: 8,
            ordered: false,
        }),
    },
};