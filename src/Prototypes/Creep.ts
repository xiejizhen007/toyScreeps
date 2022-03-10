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

    upgrade: (creep: Creep, target: StructureController): ITasks => ({
        isValidTask() {
            return creep.store[RESOURCE_ENERGY] > 0;
        },

        isValidTarget() {
            return target && target.my;
        },

        work() {
            return creep.upgradeController(target);
        },
    }),

    withdraw: (creep: Creep, target: Structure<StructureConstant> | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ITasks => ({
        isValidTask() {
            return true;
        },

        isValidTarget() {
            return true;
        },

        work() {
            return creep.withdraw(target, resourceType, amount);
        },
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
    const task = this.generateTask();
    if (task) {

    }
}

Creep.prototype.generateTask = function() {
    let task = null;
    if (this.memory.task) {
        switch (this.memory.task.type) {
            case 'harvest':
                task = Tasks['harvest'];
                break;

            case 'transfer':
                task = Tasks['transfer'];
                break;

            case 'upgrade':
                task = Tasks['upgrade'];
                break;

            case 'withdraw':
                task = Tasks['withdraw'];
                break;

            default:
                console.log(this.name + ' have a invalidTask');
                break;
        }
    }

    return task;
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