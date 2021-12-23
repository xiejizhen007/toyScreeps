import { MMemory } from "Memory";

export class Movement {
    /**
     * 短距离移动 
     */
    static goTo(creep: Creep, destination: RoomPosition, options: MoveOptions = {}): ScreepsReturnCode {
        if (creep.spawning) {
            return ERR_BUSY;
        }

        if (creep.fatigue > 0) {
            return ERR_TIRED;
        }

        // init creep move data
        if (!creep.memory.move) {
            creep.memory.move = {} as MoveData;
        }
    }

    /**
     * 远距离移动
     */
    static farGoTo(creep: Creep, destination: RoomPosition, options: MoveOptions = {}): CreepMoveReturnCode {
        if (creep.spawning) {
            return ERR_BUSY;
        } 

        if (creep.fatigue > 0) {
            return ERR_TIRED;
        }

        if (!creep.memory.move) {
            creep.memory.move = {} as MoveData;
        }

        const moveData = creep.memory.move;

        if (moveData.path && moveData.path.length > 0) {
            let pos = new RoomPosition(moveData.path[0].x, moveData.path[0].y, moveData.path[0].roomName);
            const blockCreep = pos.lookFor(LOOK_CREEPS)[0];
            if (blockCreep && this.mutualCross(creep, blockCreep)) {
                creep.memory.move.path.shift();
                return OK;
            }

            // 跨房间时不重新设置方向会反复横跳
            let dir = creep.pos.getDirectionTo(pos);
            if (!dir) {
                creep.memory.move.path.shift();
                pos = new RoomPosition(moveData.path[0].x, moveData.path[0].y, moveData.path[0].roomName);
                dir = creep.pos.getDirectionTo(pos);
            }

            if (creep.move(dir) == OK) {
                creep.memory.move.path.shift();
            }
        } else {
            const path = PathFinder.search(creep.pos, destination, {
                plainCost: 2,
                swampCost: 10,
                maxOps: 4000,
                roomCallback: roomName => {
                    if (MMemory.needAvoidRoom(roomName)) {
                        console.log('need avoid');
                        return false;
                    }

                    const room = Game.rooms[roomName];
                    if (!room) {
                        return;
                    }

                    let costs = new PathFinder.CostMatrix;

                    // room.sourceKeepers.forEach(creep => {
                    //     // costs.set(creep.pos.x, creep.pos.y, 0xff);
                    //     let xx = creep.pos.x - 3;
                    //     let yy = creep.pos.y - 3;
                    //     for (let x = 0; x < 7; x++) {
                    //         for (let y = 0; y < 7; y++) {
                    //             let xxx = xx + x;
                    //             let yyy = yy + x;
                    //             if (xxx <= 0) xxx = 1;
                    //             else if (xxx >= 60) xxx = 59;
                    //             if (yyy <= 0) xxx = 1;
                    //             else if (yyy >= 60) xxx = 59;

                    //             costs.set(xxx, yyy, 0x1f);
                    //         }
                    //     }
                    // });

                    return costs;
                },
            });

            creep.memory.move.path = path.path;
        }
    }

    static mutualCross(sourceCreep: Creep, destCreep: Creep): boolean {
        if (sourceCreep.pos.isNearTo(destCreep)) {
            if (sourceCreep.fatigue > 0 || destCreep.fatigue > 0) {
                return false;
            } else {
                const ret1 = sourceCreep.move(sourceCreep.pos.getDirectionTo(destCreep));
                const ret2 = destCreep.move(destCreep.pos.getDirectionTo(sourceCreep));
                return ret1 == OK && ret2 == OK;
            }
        } else {
            return false;
        }
    }
}