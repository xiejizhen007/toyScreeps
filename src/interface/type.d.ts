// 扩展类型

// room object 上没有 id 属性
// 为了达成更好的泛化效果，添加一个 id 属性
interface IdObject extends RoomObject {
    id: Id<IdObject>;
}

// 扩充 structure，添加 store 属性
interface StoreStructure extends Structure {
    store: StoreDefinition;
}