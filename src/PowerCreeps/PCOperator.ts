// import { PCTaskSystem } from "Network/PCTaskSystem";
import { RoomNetwork } from "Network/RoomNetwork";

export class PCOperator {
    creep: PowerCreep;
    roomNetwork: RoomNetwork;
    // pcTaskSystem: PCTaskSystem;

    constructor(creep: PowerCreep) {
        this.creep = creep;
        this.roomNetwork = Kernel.roomNetworks[creep.room.name];
        // this.pcTaskSystem = Kernel.roomNetworks[creep.room.name].pcTaskSystem;
    }

    init(): void {

    }

    work(): void {
        if (this.keepAlive()) {
            return;
        }

        // console.log("roomNetwork " + this.roomNetwork);
        // console.log("roomNetwork " + this.roomNetwork.pcTaskSystem);
        const task = this.roomNetwork.pcTaskSystem.requests[0];
        if (task) {
            const target = Game.getObjectById(task.target as Id<Structure> | Id<Source>);
            if (target) {
                if (this.creep.usePower(task.type, target) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                }
            }
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
    
    }
}