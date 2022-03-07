import { Role } from "Creeps/Role";
import { RoomNetwork } from "Network/RoomNetwork";

export class Pioneer extends Role {
    target: string;     // 目标房间号

    constructor(creep: Creep, roomNetwork: RoomNetwork, target: string) {
        super(creep, roomNetwork);
        this.target = target;
    }

    init(): void {
        if (this.creep.store.getFreeCapacity() == 0) {
            this.isWorking = true;
        } else if (this.creep.store[RESOURCE_ENERGY] == 0) {
            this.isWorking = false;
        }
    }

    work(): void {
        this.moveExit(this);

        if (!this.inTargetRoom(this)) {
            this.gotoTargetRoom(this);
            return;
        }

        if (this.isWorking) {
            if (this.buildAction(this)) {}
            else if (this.upgradeAction(this)) {}
        } else {
            this.harvestInTargetRoom(this);
        }
    }

    private gotoTargetRoom(creep: Role) {
        return creep.goto(new RoomPosition(25, 25, this.target));
    }

    private inTargetRoom(creep: Role) {
        return creep.pos.roomName == this.target;
    }

    private harvestInTargetRoom(creep: Role) {
        const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (!source || source.energy <= creep.getActiveBodyParts(WORK) * 2) {
            this.isWorking = true;
            return;
        }

        if (source) {
            if (creep.pos.isNearTo(source)) {
                creep.harvest(source);
            } else {
                creep.goto(source);
            }
        }
    }

    private buildAction(creep: Role) {
        const constructionSites = creep.room.constructionSites;
        if (constructionSites.length > 0) {
            const target = creep.pos.findClosestByRange(constructionSites);

            if (creep.pos.inRangeTo(target, 3)) {
                creep.build(target);
            } else {
                creep.goto(target);
            }

            return true;
        } else {
            return false;
        }
    }

    private upgradeAction(creep: Role) {
        const controller = creep.room.controller;
        if (controller && controller.my) {
            if (creep.pos.inRangeTo(controller, 3)) {
                creep.upgradeController(controller);
            } else {
                creep.goto(controller);
            }

            return true;
        } else {
            return false;
        }
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