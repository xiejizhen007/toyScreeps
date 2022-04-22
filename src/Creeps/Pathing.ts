import { MoveOptions } from "./Movement";

export class Pathing {
    static updateRoomStatus(room: Room) {
        if (!room) {
            // 没视野
            return;
        }

        if (room.controller) {
            if (room.controller.owner && !room.controller.my && room.towers.length > 0) {
                room.memory.dangerous = true;
                room.memory.tick = Game.time;
            } else {
                delete room.memory.dangerous;
            }
        }
    }

    static findPath(start: RoomPosition, end: RoomPosition, opts: MoveOptions = {}) {
        _.defaults(opts, {
            ignoreCreeps: true,
            maxOps: 2000,
            range: 1,
            terrainCosts: {plainCost: 1, swampCost: 5},
        });

        let ret = PathFinder.search(start, end, {
            maxOps: opts.maxOps,
            maxRooms: opts.maxRooms,
            plainCost: opts.terrainCosts.plainCost,
            swampCost: opts.terrainCosts.swampCost,
            // roomCallback:
        });

        return ret;
    }
}