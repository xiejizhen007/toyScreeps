import { Role } from "role/role";
import { CREEP_STATE } from "setting";

export class Thief extends Role {
    protected check(): void {
        if (this.creep_.memory.isNeeded && this.creep_.ticksToLive < 150) {
            this.creep_.room.addSpawnTask(this.creep_);
            this.creep_.memory.isNeeded = false;
        }

        if (this.creep_.ticksToLive < this.creep_.memory.countTime + 30) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
        }
    }

    protected prepare(): void {
        if (this.creep_.spawning) {
            this.creep_.memory.countTime = Game.time;
            return;
        }        

        if (this.creep_.room.name != this.creep_.memory.task.workRoomName) {
            this.creep_.moveTo(new RoomPosition(25, 25, this.creep_.memory.task.workRoomName));
            return;
        } else {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
            this.source();
        }
    }

    protected source(): void {
        let storage = this.creep_.room.storage;
        if (storage && storage.store.getUsedCapacity()) {
            if (this.creep_.pos.isNearTo(storage)) {
                for (const target in storage.store) {
                    // console.log()
                    const amount = Math.min(this.creep_.store.getFreeCapacity(), storage.store[target]);
                    if (this.creep_.withdraw(storage, target as ResourceConstant, amount) == OK) {
                        break;
                    }
                }
            } else {
                this.creep_.moveTo(storage, {
                    reusePath: 20
                });
            }
        }        

        if (this.creep_.store.getFreeCapacity() == 0) {
            this.creep_.memory.countTime = Game.time - this.creep_.memory.countTime;
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        }
    }

    protected target(): void {
        if (this.creep_.store.getUsedCapacity() == 0) {
            this.creep_.memory.state = CREEP_STATE.PREPARE;
            this.prepare();
            return;
        }

        const room = Game.rooms[this.creep_.memory.room];
        if (!room) {
            console.log('no room' + room.name);
            return;
        }

        const storage = room.storage;
        if (storage) {
            if (this.creep_.pos.isNearTo(storage)) {
                this.creep_.clearBody(storage);
            } else {
                this.creep_.moveTo(storage, {
                    reusePath: 20
                });
            }
        }
    }
}