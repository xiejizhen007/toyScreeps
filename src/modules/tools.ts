/**
 * 将 RoomPosition 转化成对象，方便保存
 */
export function encodePosMemory(pos: RoomPosition): PosMemory {
    return {
        x: pos.x,
        y: pos.y,
        roomName: pos.roomName,
    };
}

/**
 * 从 memory 中恢复 RoomPostion 
 */
export function decodePosMemory(posMemory: PosMemory): RoomPosition {
    return new RoomPosition(posMemory.x, posMemory.y, posMemory.roomName);
}