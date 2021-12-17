import { CREEP_STATE, DEPOSIT_MAX_COOLDOWN } from "setting";
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
        // 注意 attack 和 heal 不能在同一 tick 进行
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
            this.creep_.signController(controller, "i will uncliam this room when novice area end. don't hurt me, please!!!");
        } 
        else {
            this.creep_.goTo(controller.pos);
        }
    }
}

/**
 * 新房的开拓者，可跨传送门
 * 需要在传送门上插旗，并且指定目标房间
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
        let source = this.creep_.pos.findClosestByRange(FIND_SOURCES_ACTIVE) as Source;
        if (!source) { return; }
        
        this.creep_.getEnergyFrom(source);

        if (this.creep_.store.getFreeCapacity() == 0 || source.energy == 0) {
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

    protected override check() {
        if (this.creep_.getActiveBodyparts(HEAL) > 0 && this.creep_.hits != this.creep_.hitsMax) {
            this.creep_.heal(this.creep_);
        }

        if (this.creep_.ticksToLive < this.creep_.body.length * 3 && this.creep_.memory.isNeeded) {
            let room = Game.rooms[this.creep_.memory.room];
            room.addSpawnTask(this.creep_);
            this.creep_.memory.isNeeded = false;
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

/**
 * 挖沉积物
 * TODO: 记录前往目标的时间
 */
export class RemoteDeposit extends Role {
    protected override check() {
        if (this.creep_.ticksToLive < 10 &&  this.creep_.memory.isNeeded) {
            if (this.creep_.memory.boost != undefined) {
                let room = Game.rooms[this.creep_.memory.room];
                room.addBoostCreep(this.creep_);
            } else {
                this.creep_.room.addSpawnTask(this.creep_);
            }

            this.creep_.memory.isNeeded = false;
        }
    }

    // 去到沉积物所在地
    protected override prepare() {
        if (this.creep_.spawning) {
            this.creep_.memory.countTime = Game.time;
            return;
        }

        if (this.creep_.memory.boost) {
            this.creep_.boost();
            this.creep_.memory.countTime = Game.time;
            return;
        }

        // 去到指定房间
        if (this.creep_.room.name != this.creep_.memory.task.workRoomName) {
            this.creep_.farGoTo(new RoomPosition(25, 25, this.creep_.memory.task.workRoomName));
        } else {
            // 去到沉积物附近
            let target = Game.getObjectById(this.creep_.memory.target as Id<Deposit>);
            if (!target || target.lastCooldown >= DEPOSIT_MAX_COOLDOWN) {
                target = this.creep_.pos.findClosestByRange(FIND_DEPOSITS, {
                    filter: d => {
                        return d.lastCooldown <= DEPOSIT_MAX_COOLDOWN
                    }
                });
                this.creep_.memory.target = target ? target.id : undefined;
                if (!target) {
                    this.creep_.memory.isNeeded = false;
                }
            }

            if (this.creep_.pos.inRangeTo(target.pos, 1)) {
                this.creep_.memory.countTime = Game.time - this.creep_.memory.countTime;
                this.creep_.memory.state = CREEP_STATE.SOURCE;
                this.source();
            } else {
                this.creep_.goTo(target.pos);
            }
        }
    }

    protected override source() {
        let target = Game.getObjectById(this.creep_.memory.target as Id<Deposit>);
        if (!target || target.cooldown >= DEPOSIT_MAX_COOLDOWN) { 
            this.creep_.memory.state = CREEP_STATE.PREPARE;
            this.prepare();
            return;
        }

        if (target.cooldown == 0) {
            this.creep_.harvest(target);
        } else if (this.creep_.store.getFreeCapacity() == 0
            || this.creep_.ticksToLive < this.creep_.memory.countTime + 30) {

            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        }
    }

    // 往回送
    protected override target() {
        const room = Game.rooms[this.creep_.memory.room];
        const storage = room.storage;
        const terminal = room.terminal;

        if (this.creep_.room.name != room.name || !this.creep_.pos.inRangeTo(storage, 1)) {
            this.creep_.farGoTo(storage.pos);
        } else {
            this.creep_.clearBody(storage);

            if (this.creep_.store.getUsedCapacity() == 0) {
                this.creep_.memory.countTime = Game.time;
                this.creep_.memory.state = CREEP_STATE.PREPARE;
                this.prepare();
            }
        }
    }
}

/**
 * 角色模板
 */
export class template extends Role {
    protected override check() {

    }

    protected override prepare() {

    }

    protected override source() {

    }

    protected override target() {
        
    }
}