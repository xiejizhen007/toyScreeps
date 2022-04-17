import { RoleCarry } from "Creeps/RoleCarry";
import { DirectivePower } from "Directives/power";

export interface PBTransferMemory extends CreepMemory {
    power?: PowerBankInfo;
    finish?: boolean;
}

export class PBTransfer extends RoleCarry {
    memory: PBTransferMemory;
    flag: DirectivePower;

    constructor(creep: Creep) {
        super(creep);
        this.flag = Kernel.directives[creep.memory.flag];
        this.flag.roles[this.name] = this;
    }

    init(): void {
        this.standbyTo(this.flag.pos, 5);
    }

    work(): void {
        if (this.flag) {
            const bank = this.flag.pos.lookFor(LOOK_STRUCTURES)[0] as StructurePowerBank;
            if (!bank && this.store.getUsedCapacity() == 0 && this.room.name == this.flag.pos.roomName) {
                // power bank 炸了并且还没物资
                const resource = this.flag.pos.lookFor(LOOK_RESOURCES)[0];
                if (resource && resource.resourceType == 'power') {
                    this.pickupResource(resource);
                }
            }
        }
    }

    finish(): void {

        if (this.memory.finish) {
            console.log('pb_transfer ' + this.name + ' finish his job');
            // this.suicide();
            return;
        }

        // 回家咯
        if (this.store.getUsedCapacity() > 0) {
            if (this.transferResource(this.roomNetwork.storage, 'power') == OK) {
                // this.suicide();
                this.memory.finish = true;
            }
        }
    }
}