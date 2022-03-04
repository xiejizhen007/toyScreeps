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
    // 根据 memory 记录的任务类型执行相应的任务
    // switch(this.memory.task)
    
}

Creep.prototype.transferTo = function(target: AnyCreep | Structure<StructureConstant>, 
                                      resourceType: ResourceConstant,
                                      amount?: number): ScreepsReturnCode {
    if (!target) {
        return ERR_INVALID_TARGET;
    }

    if (this.pos.isNearTo(target)) {
        this.transfer(target, resourceType, amount);
    } else {
        // TODO: goto other room
        this.goto(target.pos);
        return ERR_NOT_IN_RANGE;
    }
}

export class CreepExtension extends Creep {
    sayHello(): void {
        this.say('hello');
    }

    // get isWorking(): boolean {
    //     return Game.creeps[this.name] && this.memory.working;
    // }

    // set isWorking(yes: boolean) {
    //     if (Game.creeps[this.name])
    //         this.memory.working = yes;
    // }
}