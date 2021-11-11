/**
 * 配合外矿使用
 * @param creep 预定者
 */
export function reserverRoom(creep: Creep) {
    if (!creep || creep.spawning) { return; }

    if (creep.memory.task.workRoomName && creep.room.name != creep.memory.task.workRoomName) {
        let room = Game.rooms[creep.memory.task.workRoomName];
        if (room && room.controller) {
            creep.farGoTo(room.controller.pos);
            return;
        }
    }

    let room = creep.room;

    if (!room.controller) { return; }

    if (creep.pos.inRangeTo(room.controller, 1)) { creep.reserveController(room.controller); }
    else { creep.goTo(room.controller.pos); }
}