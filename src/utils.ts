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