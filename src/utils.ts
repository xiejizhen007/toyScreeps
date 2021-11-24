import { roomSpawn, bodyArray, ROOM_TRANSFER_TASK } from "setting";

export const newCreep = function() {
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        if (room.controller && room.controller.my && room.memory.spawnTasks == undefined) {
            room.memory.spawnTasks = new Array();
        }

        if (room.memory.spawnTasks && room.memory.spawnTasks.length > 0) {
            let iter = room.memory.spawnTasks[0];
            let roleName = iter.role + Game.time;
            let spawn = room.find(FIND_MY_SPAWNS);

            for (let i = 0; i < spawn.length; i++) {
                let tmp = spawn[i].spawnCreep(getCreepBodys(roomSpawn[room.controller.level][iter.role]), roleName,
                    { memory: {role: iter.role, room: iter.room ? iter.room : roomName, isNeeded: iter.isNeeded ? true : false, task: iter.task}});
                
                if (tmp == OK) {
                    console.log('new creep: ' + roleName);
                    room.memory.spawnTasks.shift();
                    const task = {
                        type: ROOM_TRANSFER_TASK.FILL_EXTENSION
                    } as roomTransferTask;
                    room.addTransferTask(task);
                    // console.log('add transfer task');
                    break;
                }
                else if (tmp == ERR_NOT_ENOUGH_ENERGY && iter.role == 'queen') {
                    let en = (room.energyAvailable / 100) ^ 0;
                    if (spawn[i].spawnCreep(getCreepBodys({carry: en, move: en}), roleName,
                        { memory: {role: iter.role, room: iter.room, isNeeded: iter.isNeeded, task: iter.task}}) == OK) {
                        room.memory.spawnTasks.shift();
                    }
                    break;
                }

                // 填充 extension
                // room.addTransferTask({
                //     type: ROOM_TRANSFER_TASK.FILL_EXTENSION
                // });
                const task = {
                    type: ROOM_TRANSFER_TASK.FILL_EXTENSION
                } as roomTransferTask;
                room.addTransferTask(task);
                // console.log('add transfer task');
            }
        }
    }
}

export const assignPrototype = function(obj1: {[key: string]: any}, obj2: {[key: string]: any}) {
    Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
        if (key.includes('Getter')) {
            Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
            })
        }
        else obj1.prototype[key] = obj2.prototype[key]
    });
}

/**
 * 叫一个预定者，配合外矿
 * @param creep 呼叫预定者的角色，搭配外矿使用
 */
export function callReserver(creep: Creep) {
    // 挖外矿的出生的房间
    let room = Game.rooms[creep.memory.room];
    if (!room) { return; }
    if (!room.memory.reserverRoom) { room.memory.reserverRoom = []; }

    if (!room.memory.spawnTasks.find(task => task.role == 'reserver' && task.task.workRoomName == creep.memory.task.workRoomName)
            && !includeReserverRoom(creep.memory.task.workRoomName)) {
        // room.memory.reserverRoom.push(creep.memory.task.workRoomName);
        addReserverRoom(creep.memory.task.workRoomName);
        addRoleSpawnTask('reserver', room.name, false, creep.memory.task.workRoomName);
        return true;
    }

    return false;
}

/**
 * 给房间添加预定
 * @param workRoomName 需要预定的房间
 */
export function addReserverRoom(workRoomName: string) {
    if (!Memory.reserverRoom) { Memory.reserverRoom = []; }

    if (!Memory.reserverRoom.includes(workRoomName)) {
        Memory.reserverRoom.push(workRoomName);
        return true;
    }

    return false;
}

/**
 * 
 * @param workRoomName 删除预定
 */
export function removeReserverRoom(workRoomName: string): boolean {
    if (!Memory.reserverRoom) { return false; }

    const index = Memory.reserverRoom.indexOf(workRoomName);
    Memory.reserverRoom.splice(index);
    return true;
}

export function includeReserverRoom(workRoomName: string): boolean {
    if (!Memory.reserverRoom) { return false; }
    return Memory.reserverRoom.includes(workRoomName);
}

export function addSpawnTask(creep: Creep): boolean {
    let room = Game.rooms[creep.memory.room];
    if (!room) { return false; }
    if (!room.memory.spawnTasks) { room.memory.spawnTasks = []; }

    room.memory.spawnTasks.push({
        role: creep.memory.role,
        room: creep.memory.room,
        isNeeded: creep.memory.isNeeded,
        task: creep.memory.task,
    });

    creep.memory.isNeeded = false;
    console.log('add spawn task: ' + creep.name);
    return true;
}

/**
 * 
 * @param role 角色类型
 * @param roomName 孵化的房间
 * @param workRoomName 工作房间
 * @param isNeeded 是否需要再次孵化
 */
export function addRoleSpawnTask(role: string, roomName: string, isNeeded?: boolean, workRoomName?: string, flagName?: string): boolean {
    let room = Game.rooms[roomName];
    if (!room) { return false; }
    if (!room.memory.spawnTasks) { room.memory.spawnTasks = []; }

    room.memory.spawnTasks.push({
        role: role,
        room: room.name,
        isNeeded: isNeeded ? true : false,
        task: {
            workRoomName: workRoomName ? workRoomName : room.name,
            flagName: flagName ? flagName : undefined,
        }
    });
    console.log('add role spawn task');
    return true;
}

export const getCreepBodys = function(bodySet) {
    let ret = new Array();
    for (let name in bodySet) {
        for (let i = 0; i < bodySet[name]; i++) {
            ret.push(name);
        }
    }
    return ret;
}

export function getBodyArray(bodyset): BodyPartConstant[] {
    let ret = new Array();
    for (let name in bodyset) {
        // console.log(name);
        for (let i = 0; i < bodyset[name]; i++) {
            ret.push(name);
            // console.log(name);
        }
    }
    console.log(ret);
    return ret;
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

export function testTask(task: roomTransferTask) {
    // console.log(task.nukeID);
}

// export function addRoom(roomName: string, addRoomName: string): boolean {
//     let room = Game.rooms[roomName];
//     if (!room) { return false; }

//     // return room.addRo
// }

export function getObject(id: string): RoomObject {
    return Game.getObjectById(id);
}

export function roomWork(): void {
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        if (!room.controller || !room.controller.my) {
            continue;
        }

        let structureTargets = room.find(FIND_STRUCTURES);
        for (let i = 0; i < structureTargets.length; i++) {
            let targte = structureTargets[i];
            if (targte instanceof StructureLab) {
                targte.work();
            } else if (targte instanceof StructureTower) {
                targte.work();
            } else if (targte instanceof StructurePowerSpawn) {
                targte.work();
            } else if (targte instanceof StructureSpawn) {
                targte.work();
            } else if (targte instanceof StructureTerminal) {
                targte.work();
            }
        }
    }
}