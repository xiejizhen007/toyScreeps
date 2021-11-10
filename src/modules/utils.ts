export const getCreepBodys = function(bodySet) {
    let ret = new Array();
    for (let name in bodySet) {
        for (let i = 0; i < bodySet[name]; i++) {
            ret.push(name);
        }
    }
    return ret;
}

export const roomSpawn = {
    1: {
        harvester: { work: 1, carry: 1, move: 1},
    },
    2: {
        harvester: { work: 2, carry: 1, move: 1},
    },
    3: {
        builder: {work: 1, carry: 2, move: 2},
        harvester: { work: 3, carry: 1, move: 1},
        queen: {carry: 3, move: 3},
        upgrader: {work: 3, carry: 3, move: 3},
        repairer: {work: 2, carry: 3, move: 3},
        outputer: {carry: 4, move: 4},
    },
    4: {
        builder: {work: 5, carry: 5, move: 2},
        harvester: { work: 5, carry: 1, move: 1},
        queen: {carry: 5, move: 5},
        upgrader: {work: 5, carry: 5, move: 3},
        repairer: {work: 2, carry: 3, move: 3},
        outputer: {carry: 4, move: 4},
        transfer: {carry: 8, move: 8},
    },
    5: {
        builder: {work: 5, carry: 5, move: 2},
        harvester: { work: 5, carry: 1, move: 1},
        queen: {carry: 5, move: 5},
        upgrader: {work: 8, carry: 5, move: 3},
        repairer: {work: 2, carry: 3, move: 3},
        outputer: {carry: 4, move: 4},
        transfer: {carry: 8, move: 8},
    },
    6: {
        upgrader: {work: 12, carry: 6, move: 4},
        queen: {carry: 6, move: 6},
        king: {carry: 6, move: 6},
        builder: {work: 4, carry: 6, move: 6},
        outputer: {carry: 6, move: 6},
        harvester: {work: 6, carry: 1, move: 3},
        harvesterRoom: {work: 6, carry: 4, move: 4},
        harvesterMineral: {work: 5, carry: 6, move: 6},
        repairer: {work: 4, carry: 4, move: 4},
        transfer: {carry: 8, move: 8},
        transferRoom: {carry: 10, move: 10}, 
        claimer: {claim: 1, move: 4},
    },
    7: {
        harvester: {work: 6, carry: 1, move: 3}, 
        transfer: {carry: 10, move: 10},
        transferRoom: {carry: 20, move: 20},
        repairer: {work: 6, carry: 6, move: 6},
        repairerWall: {work: 5, carry: 10, move: 10},
        upgrader: {work: 30, carry: 6, move: 8},
        builder: {work: 8, carry: 8, move: 8},
        outputer: {carry: 15, move: 15},
        king: {carry: 10, move: 10},
        queen: {carry: 10, move: 10},
        harvesterMineral: {work: 5, carry: 6, move: 6},
        soldier: {tough: 9, attack: 16, move: 25},
        docter: {tough: 9, heal: 16, move: 25},
        creepLab: {carry: 10, move: 10},
        test: {attack: 1, heal: 1, move: 2},
        creepTransfer: {carry: 4, move: 4},
    },
    8: {
        harvester: {work: 6, carry: 1, move: 3}, 
        transfer: {carry: 10, move: 10},
        transferRoom: {carry: 20, move: 20},
        repairer: {work: 6, carry: 6, move: 6},
        repairerWall: {work: 5, carry: 10, move: 10},
        upgrader: {work: 1, carry: 1, move: 1},
        builder: {work: 15, carry: 20, move: 15},
        outputer: {carry: 10, move: 10},
        king: {carry: 10, move: 10},
        queen: {carry: 20, move: 20},
        harvesterMineral: {work: 5, carry: 6, move: 6},
        soldier: {tough: 9, attack: 16, move: 25},
        docter: {tough: 9, heal: 16, move: 25},
        creepLab: {carry: 10, move: 10},
        test: {attack: 1, heal: 1, move: 2},
        creepTransfer: {carry: 4, move: 4},
        creepPS: {carry: 6, move: 6},
        // test
        harvesterRoom: {work: 1, carry: 1, move: 1},
        reserver: {claim: 2, move: 10},
    }
}

export const hasTransferTask = function (room: Room, taskType: string) : boolean {
    if (!room.memory.transferTasks) { room.memory.transferTasks = []; }
    if (!room.memory.exeTransferTasks) { room.memory.exeTransferTasks = []; }

    let taskYes = false;
    for (let i = 0; i < room.memory.transferTasks.length; i++) {
        const task = room.memory.transferTasks[i];
        if (task.type == taskType) {
            taskYes = true;
            break;
        }
    }

    for (let i = 0; i < room.memory.exeTransferTasks.length; i++) {
        const task = room.memory.exeTransferTasks[i];
        if (task.type == taskType) {
            taskYes = true;
            break;
        }
    }

    return taskYes;
}

export const addTransferTask = function (room: Room, task: any) {
    if (!room.memory.transferTasks) { room.memory.transferTasks = new Array(); }

    room.memory.transferTasks.push(task);
}