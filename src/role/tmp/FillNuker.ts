import { Role } from "role/role";
import { CREEP_STATE } from "setting";

/**
 * 填充 nuker
 */
export class FillNuker extends Role {
    protected check(): void {
        const target = Game.getObjectById(this.creep_.memory.target as Id<StructureNuker>);
        if (!target) {
            return;
        }

        if (!target.store.getFreeCapacity(RESOURCE_ENERGY) &&
            !target.store.getFreeCapacity("G")) {

            this.creep_.memory.isNeeded = false;
            // this.creep_.suicide
        }

        if (this.creep_.memory.isNeeded && this.creep_.ticksToLive < 50) {
            this.creep_.room.addSpawnTask(this.creep_);
            this.creep_.memory.isNeeded = false;
        }
    }

    protected prepare(): void {
        if (this.creep_.spawning) {
            return;
        }        

        let target = this.creep_.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_NUKER
        });

        if (target) {
            this.creep_.memory.target = target.id;
            this.creep_.memory.state = CREEP_STATE.SOURCE;   
            this.source();
        }
    }

    protected source(): void {
        const target = Game.getObjectById(this.creep_.memory.target as Id<StructureNuker>);
        let amount: number;
        let resourceType: ResourceConstant;
        if (target) {
            if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                amount = Math.min(target.store.getFreeCapacity(RESOURCE_ENERGY), this.creep_.store.getFreeCapacity());
                resourceType = RESOURCE_ENERGY;
            } else if (target.store.getFreeCapacity("G") > 0) {
                amount = Math.min(target.store.getFreeCapacity("G"), this.creep_.store.getFreeCapacity());
                resourceType = "G";
            }
        } else {
            this.creep_.memory.state = CREEP_STATE.PREPARE;
            this.prepare();
            return;
        }

        this.creep_.memory.resourceType = resourceType;

        const terminal = this.creep_.room.terminal!;
        if (terminal.store[resourceType] > amount) {
            if (this.creep_.withdrawFrom(terminal, resourceType, amount) == OK) {
                this.creep_.memory.state = CREEP_STATE.TARGET;
                // this.target();
            }
        }
    }

    protected target(): void {
        const target = Game.getObjectById(this.creep_.memory.target as Id<StructureNuker>);
        if (target) {
            if (this.creep_.transferTo(target, this.creep_.memory.resourceType) == OK) {
                this.creep_.memory.state = CREEP_STATE.SOURCE;
                // console.log('transfer return OK');
                // console.log('creep free carry: ' + this.creep_.store.getFreeCapacity());
            }
        }

        if (this.creep_.store[this.creep_.memory.resourceType] == 0) {
            this.creep_.memory.state = CREEP_STATE.SOURCE;
        }
    }
}