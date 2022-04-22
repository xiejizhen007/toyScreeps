import { Role } from "Creeps/Role";
import { MineSite } from "Network/MineSite";

export class Miner extends Role {
    mineSite: MineSite;
    mineral: Mineral;

    init(): void {
        this.mineSite = this.roomNetwork.mineSite;
    }

    work(): void {
        if (this.timeToDie()) { return; }

        if (this.mineSite) {
            this.mineral = this.mineSite.mineral;

            if (this.mineSite.container) {
                const lookResource = this.mineSite.container.pos.lookFor(LOOK_RESOURCES)[0];
                if (lookResource) {
                    if (this.creep.store.getFreeCapacity() == 0 && this.mineSite.container.store.getFreeCapacity() > 0) {
                        this.creep.drop(this.mineral.mineralType);
                    } else if (this.creep.store.getFreeCapacity() > 0) {
                        this.creep.pickup(lookResource);
                    }
                }
            }

            if (this.mineral.mineralAmount > 0 && this.mineSite.container) {
                if (this.creep.pos.isEqualTo(this.mineSite.container) && this.mineSite.extractor.cooldown == 0) {
                    this.creep.harvest(this.mineral);
                } else {
                    this.goto(this.mineSite.container.pos);
                }
            }        
        }
    }

    finish(): void {

    }

    private timeToDie(): boolean {
        if (this.creep.ticksToLive < 3) {
            if (this.creep.store.getUsedCapacity() > 0) {
                for (const resourceType in this.creep.store) {
                    this.creep.drop(resourceType as ResourceConstant);
                }

                return true;
            }
        }

        return false;
    }
}