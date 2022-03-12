import { Role } from "./Role";
import { Roles } from "./setups";

export const MovePriorities = {
    [Roles.king]: 0,
    [Roles.queen]: 1,
    [Roles.harvester]: 2,
    [Roles.worker]: 3,

    default: 10,
}

export class Movement {
    static goto(creep: Role, pos: RoomPosition | RoomObject): ScreepsReturnCode {
        if (pos instanceof RoomObject) {
            pos = pos.pos;
        }

        return OK;
    }
    
    // a 的优先级大于 b
    private static acceptCrossCreep(a: Role, b: Role): boolean {
        if (!a.my || !b.my) {
            return false;
        }

        const aPriority = MovePriorities[a.memory.role] || MovePriorities.default;
        const bPriority = MovePriorities[b.memory.role] || MovePriorities.default;

        if (aPriority >= bPriority && a.pos.isNearTo(b)) {
            return true;
        }
    
        return false;
    }

    // 发起对穿
    static crossCreep(a: Role, b: Role) {
        if (this.acceptCrossCreep(a, b)) {
            const aDir = a.pos.getDirectionTo(b);
            const bDir = b.pos.getDirectionTo(a);

            a.move(aDir);
            b.move(bDir);
        }
    }
}