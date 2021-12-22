export class Movement {
    static farGoTo(creep: Creep, destination: RoomPosition, options: MoveOptions = {}): ScreepsReturnCode {
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
}