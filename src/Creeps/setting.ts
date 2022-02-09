/*
* creep role
*/

const CreepRole = {
    queen: {
        body: [CARRY, MOVE],
        limit: Infinity,
    },
    harvester: {
        body: [WORK, CARRY, MOVE],
        limit: 10,
    },
    miner: {
        body: [WORK, WORK, CARRY, MOVE],
        limit: 10,
    }
}