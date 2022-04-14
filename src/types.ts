export interface StoreStructure extends Structure {
    store: StoreDefinition;
}

export interface IdObject extends RoomObject {
    id: Id<IdObject>;
}