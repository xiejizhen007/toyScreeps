import { Role } from "role/role";
import { CREEP_STATE } from "setting";

export class Thief extends Role {
    protected check(): void {
        if (this.creep_.memory.isNeeded && this.creep_.ticksToLive < 150) {
            // this.creep_.room.addSpawnTask(this.creep_);
            const room = Game.rooms[this.creep_.memory.room];
            room.addSpawnTask(this.creep_);
            this.creep_.memory.isNeeded = false;
        }

        // if (this.creep_.ticksToLive < this.creep_.memory.countTime + 30) {
        //     this.creep_.memory.state = CREEP_STATE.TARGET;
        // }
    }

    protected prepare(): void {
        if (this.creep_.spawning) {
            // this.creep_.memory.countTime = Game.time;
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
        const storage = this.creep_.room.storage;
        const terminal = this.creep_.room.terminal;

        // let target: StructureStorage | StructureTerminal | Ruin;
        let target = Game.getObjectById(this.creep_.memory.target as Id<StructureStorage> | Id<StructureTerminal> | Id<Ruin>);

        // console.log('')
        if (target) {
            console.log(target.pos + ' store ' + target.store.getUsedCapacity());
        }

        if (target && target.store.getUsedCapacity() > 0) {
            if (this.creep_.pos.isNearTo(target)) {
                for (const resourceType in target.store) {
                    const amount = Math.min(this.creep_.store.getFreeCapacity(), target.store[resourceType]);
                    const ret = this.creep_.withdraw(target, resourceType as ResourceConstant, amount);
                    console.log('reosurceType: ' + resourceType + ' minAmount: ' + amount + 'ret: ' + ret);
                    if (ret == OK) {
                        break;
                    }
                }
            } else {
                this.creep_.moveTo(target, {
                    reusePath: 20
                });
            }
        } else {
            if (storage && storage.store.getUsedCapacity()) {
                target = storage;
            } else if (terminal && terminal.store.getUsedCapacity()) {
                target = terminal;
            } else {
                target = this.creep_.pos.findClosestByRange(FIND_RUINS, {
                    filter: r => {
                        console.log(r.pos + ' store ' + r.store.getUsedCapacity());
                        return r.store.getUsedCapacity() > 0;
                    }
                });
            }
            
            if (target) {
                this.creep_.memory.target = target.id;
            } else {
                this.creep_.memory.isNeeded = false;
            }
        }

        if (this.creep_.store.getFreeCapacity() == 0) {
            // this.creep_.memory.countTime = Game.time - this.creep_.memory.countTime;
            this.creep_.memory.state = CREEP_STATE.TARGET;
            this.target();
        }
    }

    protected target(): void {
        if (this.creep_.store.getUsedCapacity() == 0) {
            // this.creep_.memory.countTime = Game.time;
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