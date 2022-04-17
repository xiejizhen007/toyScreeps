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

/**
 * 返回 pos 旁边空闲的位置，比如说 source 旁边的空闲位置
 * @param pos 
 */
export function freeLocationIn(pos: RoomPosition): number {
    let num = 0;
    const terrain = new Room.Terrain(pos.roomName);
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let x = pos.x + i;
            let y = pos.y + j;
            num += terrain.get(x, y) != TERRAIN_MASK_WALL ? 1 : 0;
        }
    }

    return num;
}