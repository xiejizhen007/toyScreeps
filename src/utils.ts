import { getCreepBodys, roomSpawn } from "./modules/utils";

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
                    break;
                }
                else if (tmp == ERR_NOT_ENOUGH_ENERGY && iter.role == 'queen') {
                    let en = room.energyAvailable / 100;
                    // console.log('energy: ' + en % 1);
                    // console.log('queen body parts: ' + getCreepBodys({carry: en, move: en}));
                    if (spawn[i].spawnCreep(getCreepBodys({carry: en, move: en}), roleName,
                        { memory: {role: iter.role, room: iter.room, isNeeded: iter.isNeeded, task: iter.task}}) == OK) {
                        room.memory.spawnTasks.shift();
                        break;
                    }
                }
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
    })
}

/**
 * 叫一个预定者，配合外矿
 * @param creep 呼叫预定者的角色，搭配外矿使用
 */
export function needReserver(creep: Creep) {
    // 挖外矿的出生的房间
    let room = Game.rooms[creep.memory.room];
    if (!room) { return; }

    addRoleSpawnTask('reserver', room.name, creep.memory.task.workRoomName);
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
export function addRoleSpawnTask(role: string, roomName: string, workRoomName?: string, isNeeded?: boolean, flagName?: string): boolean {
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