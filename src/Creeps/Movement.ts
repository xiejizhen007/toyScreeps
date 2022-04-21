import { Role } from "./Role";
import { Roles } from "./setups";

export const MovePriorities = {
    [Roles.king]: 0,
    [Roles.queen]: 1,
    [Roles.harvester]: 2,
    [Roles.worker]: 3,

    default: 10,
}

export interface MoveOptions {
    ignoreCreeps?: boolean;                         // 将其他 creep 所处的地块视作可通行的。在附近有大量移动的 creep 或者其他一些情况时会很有用。默认值为 false。
    ignoreDestructibleStructures?: boolean;         // 将可破坏的建筑 (constructed walls, ramparts, spawns, extensions) 所在的地块视作可通行的。默认为 false。
    ignoreRoads?: boolean;                          // 无视道路。启用该项将加快搜索速度。默认值为 false。
    terrainCosts?: {                                // 移动成本
        plainCost: number;                              // 平原地形的移动成本
        swampCost: number;                              // 沼泽地形的移动成本
    };
    maxOps?: number;                                // 用于寻路的消耗上限。你可以限制在寻路上花费的 CPU 时间，基于 1 op ~ 0.001 CPU 的比例。默认值为 2000。
    maxRooms?: number;                              // 寻路所允许的最大房间数。默认值为 16。
    range?: number;                                 // 找到到达位于目标指定线性区域内位置的路径。
    preferHighway?: boolean;                        // 优先过道
    // waypoints?: RoomPosition[];                     // 需要经过的点，比如说可能需要走传送门
    avoidSK?: boolean;                              // 是否需要避开 Source Keeper，默认为 false
    wayRooms?: string[];                            // 需要路过的房间名
}

export class Movement {
    static goto(creep: Role, pos: RoomPosition | RoomObject, opts: MoveOptions = {}): ScreepsReturnCode {
        if (pos instanceof RoomObject) {
            pos = pos.pos;
        }

        _.defaults(opts, {
            range: 1,
            terrainCosts: {
                plainCost: 1,
                swampCost: 5,
            },
            maxOps: 2000,
            maxRoom: 16,
        });

        return OK;
    }
    
    // // a 的优先级大于 b
    // private static acceptCrossCreep(a: Role, b: Role): boolean {
    //     if (!a.my || !b.my) {
    //         return false;
    //     }

    //     const aPriority = MovePriorities[a.memory.role] || MovePriorities.default;
    //     const bPriority = MovePriorities[b.memory.role] || MovePriorities.default;

    //     if (aPriority >= bPriority && a.pos.isNearTo(b)) {
    //         return true;
    //     }
    
    //     return false;
    // }

    // // 发起对穿
    // static crossCreep(a: Role, b: Role) {
    //     if (this.acceptCrossCreep(a, b)) {
    //         const aDir = a.pos.getDirectionTo(b);
    //         const bDir = b.pos.getDirectionTo(a);

    //         a.move(aDir);
    //         b.move(bDir);
    //     }
    // }
}