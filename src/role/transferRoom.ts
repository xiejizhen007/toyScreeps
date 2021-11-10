// 专门运外矿的能量回家
export function transferRoom(creep: Creep) {
    // 还没出生
    if (!creep || creep.spawning) { return; }

    // 去到房间拿了就走
    // 初步思路，往回走的过程中，如果自己才装了不到一半，看看回来的路上有没有多余的能量可拿
    // 避着点 npc，同样，如果被打了，1500 tick 在复活
    
    
}