import { StoreStructure } from "types";
import { Role } from "./Role"

export abstract class RoleWork extends Role {
    abstract init(): void;
    abstract work(): void;
    abstract finish(): void;

    withdrawResource(target: StoreStructure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode {
        if (!target) {
            return ERR_INVALID_TARGET;
        }

        if (this.pos.isNearTo(target)) {
            return this.withdraw(target, resourceType, amount);
        } else {
            this.goto(target);
            return ERR_NOT_IN_RANGE;
        }
    }

    transferResource(target: StoreStructure | AnyCreep, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode {
        if (!target) {
            return ERR_INVALID_TARGET;
        }

        if (this.pos.isNearTo(target)) {
            return this.transfer(target, resourceType, amount);
        } else {
            this.goto(target);
            return ERR_NOT_IN_RANGE;
        }
    }

    pickupResource(target: Resource): ScreepsReturnCode {
        if (!target) {
            return ERR_INVALID_TARGET;
        }

        if (this.pos.isNearTo(target)) {
            return this.pickup(target);
        } else {
            this.goto(target);
            return ERR_NOT_IN_RANGE;
        }
    }

    // 去 pos 处待命
    standbyTo(pos: RoomObject | RoomPosition, range: number = 1) {
        pos = pos instanceof RoomObject ? pos.pos : pos;

        if (this.pos.inRangeTo(pos, range)) {
            return true;
        } else {
            this.goto(pos);
            return false;
        }
    }
}