Creep.prototype.goto = function(pos: RoomPosition): ScreepsReturnCode {
    return this.moveTo(pos);
}

Creep.prototype.withdrawFrom = function(target: Structure | Tombstone | Ruin, 
                                        resourceType: ResourceConstant, 
                                        amount?: number): ScreepsReturnCode {
    if (!target) {
        return ERR_INVALID_TARGET;
    }

    if (this.pos.isNearTo(target)) {
        return this.withdraw(target, resourceType, amount);
    } else {
        this.goto(target.pos);
        return ERR_NOT_IN_RANGE;
    }
}

Creep.prototype.work = function() {

}

export class CreepExtension extends Creep {

}