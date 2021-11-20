import { ROOM_TRANSFER_TASK } from "setting";

export default class PowerSpawnExtension extends StructurePowerSpawn {
    public generatePower(): void {
        if (this.store[RESOURCE_POWER] >= 1 && this.store[RESOURCE_ENERGY] >= 50) {
            this.processPower();
        }
        else {
            const resourceType = this.store[RESOURCE_POWER] < this.store[RESOURCE_ENERGY] / 50 ? RESOURCE_POWER : RESOURCE_ENERGY;
            this.callResource(resourceType);
        }
    }

    private callResource(resourceType: ResourceConstant): void {
        this.room.addTransferTask({
            type: ROOM_TRANSFER_TASK.FILL_POWERSPAWN,
            id: this.id,
            resourceType: resourceType
        });
    }
}