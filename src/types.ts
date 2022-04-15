export interface StoreStructure extends Structure {
    store: StoreDefinition;
}

export interface IdObject extends RoomObject {
    id: Id<IdObject>;
}

// 房间是不是过道
export function isHighWay(room: string) {
    return room.includes("0");
}