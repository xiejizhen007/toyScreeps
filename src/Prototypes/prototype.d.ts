interface Room {
    creeps: Creep[];
    myCreeps: Creep[];
    structures: Structure[];
}

interface Creep {
    goto(pos: RoomPosition): ScreepsReturnCode;
}