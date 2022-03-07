import { Role } from "Creeps/Role";
import { Colony } from "Network/Colony";

export class Claimer extends Role {
    target: string;
    colony: Colony;

    init(): void {
        this.colony = this.roomNetwork.colony;
        if (this.colony) {
            this.target = this.colony.target;
        }
    }

    work(): void {
        this.moveExit(this);

        if (!this.inTargetRoom(this)) {
            this.gotoTargetRoom(this);
            return;
        }

        const room = Game.rooms[this.target]
        const controller = room ? room.controller : null;

        if (controller) {
            if (!controller.my) {
                if (this.pos.isNearTo(controller)) {
                    if (controller.owner) {
                        this.attackController(controller);
                    } else {
                        this.claimController(controller);
                    }
                } else {
                    this.goto(controller);
                }
            } 
        }
    }

    private gotoTargetRoom(creep: Role) {
        return creep.goto(new RoomPosition(25, 25, this.target));
    }

    private inTargetRoom(creep: Role) {
        return creep.pos.roomName == this.target;
    }
    
    private moveExit(creep: Role) {
        if (creep.pos.x == 0) {
            creep.move(RIGHT);
        } else if (creep.pos.x == 49) {
            creep.move(LEFT);
        } else if (creep.pos.y == 0) {
            creep.move(BOTTOM)
        } else if (creep.pos.y == 49) {
            creep.move(TOP);
        }
    }
}