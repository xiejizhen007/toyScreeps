export class Movement {
    static goto(creep: Creep, pos: RoomPosition | RoomObject): ScreepsReturnCode {
        if (pos instanceof RoomObject) {
            pos = pos.pos;
        }

        return OK;
    }
    
}