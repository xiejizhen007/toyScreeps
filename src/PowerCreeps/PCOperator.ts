import { PowerCreepTaskQueue } from "Network/PowerCreepTaskQueue";
import { RoomNetwork } from "Network/RoomNetwork";

export class PCOperator {
    creep: PowerCreep;
    roomNetwork: RoomNetwork;
    pcTaskQueue: PowerCreepTaskQueue;

    constructor(_creep: PowerCreep) {
        this.creep = _creep;
        // this.creep.memory.workRoom
    }

    init(): void {

    }

    work(): void {
        if (this.keepAlive()) {
            return;
        }
    }

    private keepAlive(): boolean {
        if (this.creep.ticksToLive < 150) {
            // find a power spawn
            const spawn = Game.getObjectById(this.creep.memory.keepAlive);
            if (!spawn) {
                const tmpSpawn = this.creep.room.structures.find(f => f.structureType == STRUCTURE_POWER_SPAWN) as StructurePowerSpawn;
                if (tmpSpawn) {
                    this.creep.memory.keepAlive = tmpSpawn.id;
                }
            } else {
                if (this.creep.renew(spawn) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(spawn);
                }
            }
            return true;
        }

        return false;
    }

    private setTask() {
        const task = this.pcTaskQueue.front();
        if (task) {
            this.creep.memory.target = task.target;
            this.creep.memory.power = task.type;
        }
    }
}