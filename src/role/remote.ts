import { CREEP_STATE } from "setting";
import { Role } from "./role";

/**
 * 外矿的开矿人
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
 * 签名
 * （反复横跳中）
 */
export class Signer extends Role {
    protected override prepare() {
        if (this.creep_.memory.task.workRoomName && this.creep_.memory.task.workRoomName != this.creep_.room.name) {
            this.creep_.farGoTo(new RoomPosition(25, 25, this.creep_.memory.task.workRoomName));
            return;
        }

        this.creep_.memory.state = CREEP_STATE.TARGET;
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


// TODO： 能正常通过传送门，但是不能正确的去到工作房间
export class Farmove extends Role {
    protected override prepare() {
        const flag = Game.flags[this.creep_.memory.task.flagName];
        if (this.creep_.spawning || !flag) { return; }

        // 先走到传送门，传送之后去到指定房间
        if (!this.creep_.memory.ready) {
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
    }

    protected override target() {

    }

}