interface ITasks {
    isValidTask(): boolean;
    isValidTarget(): boolean;
    work(): ScreepsReturnCode;
}

const Tasks = {
    harvest: (creep: Creep, target: Source | Mineral<MineralConstant> | Deposit): ITasks => ({
        isValidTask: () => {
            // return true;
            return creep.store.getFreeCapacity() > 0;
        },

        isValidTarget() {
            if (target instanceof Source) {
                return target.energy > 0;
            } else if (target instanceof Mineral) {
                return target.mineralAmount > 0;
            } else if (target instanceof Deposit) {
                return target.cooldown == 0;
            }
        },

        work() {
            return creep.harvest(target);
        },
    }),

    transfer: (creep: Creep, target: Structure<StructureConstant> | AnyCreep, resourceType: ResourceConstant, amount?: number): ITasks => ({
        isValidTask() {
            const trueAmount = amount || 1;
            return creep.store[resourceType] >= trueAmount;
        },

        isValidTarget() {
            const trueAmount = amount || 1;
            return true;            
        },

        work() {
            return creep.transfer(target, resourceType, amount);
        }
    }),
}

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
    // Tasks.harvest(this, Game.getObjectById('da'));
    // const task = Tasks;
    // task['']
}

Creep.prototype.tasks = Tasks;

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

    // task


    // get isWorking(): boolean {
    //     return Game.creeps[this.name] && this.memory.working;
    // }

    // set isWorking(yes: boolean) {
    //     if (Game.creeps[this.name])
    //         this.memory.working = yes;
    // }
}