import { Role } from "Creeps/Role";
import { UpgradeSite } from "Network/UpgradeSite";

export class Upgrader extends Role {
    upgradeSite: UpgradeSite;

    init(): void {
        this.upgradeSite = this.roomNetwork.upgradeSite;

        if (this.creep.store[RESOURCE_ENERGY] == 0) {
            this.creep.memory.working = false;
        } else if (this.creep.store.getFreeCapacity() == 0) {
            this.creep.memory.working = true;
        }
    }

    work(): void {
        if (this.creep.memory.working) {
            if (this.creep.pos.inRangeTo(this.roomNetwork.upgradeSite.controller, 3)) {
                this.creep.upgradeController(this.roomNetwork.upgradeSite.controller);
            } else {
                this.creep.goto(this.roomNetwork.upgradeSite.controller.pos);
            }
        } else {
            const ret = this.getEnergy();
            if (ret == OK) {
                this.creep.memory.working = true;
            }
        }
    }

    private getEnergy(): ScreepsReturnCode {
        let energy: Structure | Resource;
        if (this.creep.room.storage && this.creep.room.storage.store[RESOURCE_ENERGY] > 0) {
            energy = this.creep.room.storage;
        } else if (this.creep.room.terminal && this.creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
            energy = this.creep.room.terminal;
        } else if (this.creep.room.find(FIND_DROPPED_RESOURCES).length) {
            energy = this.creep.pos.findClosestByRange(this.creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: d => d.resourceType == RESOURCE_ENERGY
            }));
        }

        if (energy) {
            // console.log('energy: ' + energy);
            if (energy instanceof Structure) {
                return this.creep.withdrawFrom(energy, RESOURCE_ENERGY);
            } else {
                if (this.creep.pos.isNearTo(energy)) {
                    return this.creep.pickup(energy);
                } else {
                    this.creep.goto(energy.pos);
                    return ERR_NOT_IN_RANGE;
                }
            }
        } else {
            console.log('room ' + this.creep.room.name + ' no energy');
            return ERR_NOT_ENOUGH_ENERGY;
        }
    }
}