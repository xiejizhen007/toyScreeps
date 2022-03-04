import { Global } from "Global/Global"

PowerCreep.prototype.work = function(): void {
    if (this.keepAlive()) { return; }
}

PowerCreep.prototype.getTask = function(): void {
    const roomNetwork = Global.roomNetworks[this.memory.workRoom];
    if (!roomNetwork) { return; }

    const task = roomNetwork.powerCreepTaskQueue.pop();
    this.memory.task = task;
}

PowerCreep.prototype.keepAlive = function(): boolean {
    if (this.tickToLive <= 100) {
        const powerSpawn = this.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_POWER_SPAWN
        });

        if (powerSpawn[0]) {
            if (this.renew(powerSpawn[0]) == ERR_NOT_IN_RANGE) {
                this.moveTo(powerSpawn[0]);
            }
        }

        return true;
    }

    return false;
}