import { CREEP_STATE } from "setting";
import { Role } from "./role";

/**
 * 挖外矿
 * 当外矿离原房间比较近时，采用挖运分离的形式
 * 如果比较远，就自己挖了就往回走
 */
export class RemoteHarvester extends Role {
    public work() {
        super.work();
    }

    protected override prepare() {
        
    }

    protected override source() {

    }

    protected override target() {

    }
}

/**
 * 攻击 npc core
 */
export class RemoteSoldier extends Role {
    protected override prepare() {
        if (this.creep_.memory.task.workRoomName && this.creep_.memory.task.workRoomName != this.creep_.room.name) {
            this.creep_.farGoTo(new RoomPosition(25, 25, this.creep_.memory.task.workRoomName));
        } else {
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        }
    }

    protected override target() {
        let target = Game.getObjectById(this.creep_.memory.target as Id<Creep | StructureInvaderCore>);
        if (!target) {
            target = this.creep_.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_INVADER_CORE
            }) as StructureInvaderCore;

            if (!target) {
                target = this.creep_.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
            }

            if (target) {
                this.creep_.memory.target = target.id;
            }
        }

        if (target) {
            const tmp = this.creep_.attack(target);
            if (tmp == ERR_NOT_IN_RANGE) {
                this.creep_.goTo(target.pos);
            }
        }
    }

    protected override check() {
        if (this.creep_.getActiveBodyparts(HEAL) > 0 && this.creep_.hits != this.creep_.hitsMax) {
            this.creep_.heal(this.creep_);
        }
    }
}

/**
 * 签名
 * （反复横跳中）
 */
export class Signer extends Role {
    protected override prepare() {
        if (this.creep_.memory.task.workRoomName && this.creep_.memory.task.workRoomName != this.creep_.room.name) {
            this.creep_.farGoTo(new RoomPosition(25, 25, this.creep_.memory.task.workRoomName));
        } else {
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        }
    }

    protected override source() {

    }

    protected override target() {
        const controller = this.creep_.room.controller;
        if (!controller) {
            this.creep_.say("noTarget");
            return;
        }

        if (this.creep_.pos.inRangeTo(controller, 1)) {
            this.creep_.signController(controller, "hello");
        } 
        else {
            this.creep_.goTo(controller.pos);
        }
    }
}

/**
 * 跨传送门，目前为测试代码，未确定任务
 */
export class Pioneer extends Role {
    protected override prepare() {
        const flag = Game.flags[this.creep_.memory.task.flagName];
        if (this.creep_.spawning) { return; }

        // 先走到传送门，传送之后去到指定房间
        if (!this.creep_.memory.ready && flag) {
            if (this.creep_.pos.inRangeTo(flag, 1)) {
                this.creep_.move(this.creep_.pos.getDirectionTo(flag));
                this.creep_.memory.ready = true;
            } else {
                this.creep_.farGoTo(flag.pos);
            }
        } else {
            if (this.creep_.room.name != this.creep_.memory.task.workRoomName) {
                this.creep_.farGoTo(new RoomPosition(25, 25, this.creep_.memory.task.workRoomName));
            } else {
                // 去到房间得立马执行下一步操作，否则就会反复横跳
                this.creep_.memory.state = CREEP_STATE.SOURCE;
                this.source();
            }
        }
    }

    protected override source() {
        let source = this.creep_.pos.findClosestByRange(FIND_SOURCES) as Source;
        this.creep_.getEnergyFrom(source);

        if (this.creep_.store.getFreeCapacity() == 0) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        }
    }

    protected override target() {
        if (this.creep_.store[RESOURCE_ENERGY] == 0) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
            this.source();
            return;
        }

        let constructionSite = Game.getObjectById(this.creep_.memory.task.constructionSiteID as Id<ConstructionSite>);
        if (!constructionSite) {
            constructionSite = this.creep_.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
            if (constructionSite) {
                this.creep_.memory.task.constructionSiteID = constructionSite.id;
            }
        }

        if (constructionSite) {
            if (this.creep_.pos.inRangeTo(constructionSite, 3)) {
                this.creep_.build(constructionSite);
            } else {
                this.creep_.goTo(constructionSite.pos);
            }
            return;
        }

        let controller = this.creep_.room.controller;
        if (controller) {
            if (this.creep_.pos.inRangeTo(controller, 3)) {
                this.creep_.upgradeController(controller);
            } else {
                this.creep_.goTo(controller.pos);
            }
            return;
        }
    }

}

/**
 * 开新房
 */
export class Claimer extends Role {
    protected override prepare() {
        const flag = Game.flags[this.creep_.memory.task.flagName];
        if (this.creep_.spawning) { return; }
        
        this.heal();
        // 需要走传送门
        if (!this.creep_.memory.ready && flag) {
            if (this.creep_.pos.inRangeTo(flag, 1)) {
                this.creep_.move(this.creep_.pos.getDirectionTo(flag));
                this.creep_.memory.ready = true;
            } else {
                this.creep_.farGoTo(flag.pos);
            }
        } else {
            if (this.creep_.room.name != this.creep_.memory.task.workRoomName) {
                this.creep_.farGoTo(new RoomPosition(25, 25, this.creep_.memory.task.workRoomName));
            } else {
                // 去到房间得立马执行下一步操作，否则就会反复横跳
                this.creep_.memory.state = CREEP_STATE.TARGET;
                this.target();
            }
        }
    }

    protected override target() {
        this.heal();
        const controller = this.creep_.room.controller;
        if (!controller) {
            console.log('claimer no target, suicide now');
            this.creep_.say('no target');
            return;
        }

        if (this.creep_.pos.inRangeTo(controller, 1)) {
            if (!controller.my) {
                if (this.creep_.claimController(controller) == ERR_INVALID_TARGET) {
                    this.creep_.attackController(controller);
                }
            }
        } else {
            this.creep_.goTo(controller.pos);
        }

    }

    private heal() {
        if (this.creep_.getActiveBodyparts(HEAL) > 0 && this.creep_.hits != this.creep_.hitsMax) {
            this.creep_.heal(this.creep_);
        }
    }
}