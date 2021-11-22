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
        this.creep_.say('remote');   
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