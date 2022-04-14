import { Role } from "Creeps/Role";

export class Worker extends Role {

    constructionSites: ConstructionSite[];

    init(): void {
        this.registerObjects();

        if (!this.creep.memory.tempTask) {
            this.creep.memory.tempTask = {
                type: 'build',
            }
        }
    }

    work(): void {
        if (this.upgradeActionWhenDownGrade()) { return; }
        if (this.buildAction()) { return; }

        // 最低优先级        
        if (this.upgradeAction()) { return; }
    }

    finish(): void {

    }

    private registerObjects(): void {
        this.constructionSites = this.roomNetwork.constructionSites;
    }

    private buildAction(): boolean {
        if (this.constructionSites.length > 0) {
            if (this.creep.store[RESOURCE_ENERGY] == 0) {
                const energy = this.getEnergy();
                if (energy) {
                    this.getResource(energy, RESOURCE_ENERGY);
                }
            } else {
                let target = Game.getObjectById(this.creep.memory.tempTask.target as Id<ConstructionSite>);
                if (target) {
                    if (this.creep.pos.inRangeTo(target, 3)) {
                        this.creep.build(target);
                    } else {
                        this.creep.goto(target.pos);
                    }
                } else {
                    target = this.creep.pos.findClosestByRange(this.constructionSites);
                    if (target) {
                        this.creep.memory.tempTask.target = target.id;
                    }
                }
            }


            return true;
        }

        return false;
    }
    
    private upgradeActionWhenDownGrade(): boolean {
        const controller = this.room.controller;
        if (controller && controller.ticksToDowngrade <= 2000) {
            this.upgradeAction();
            return true;
        }

        return false;
    }

    private upgradeAction(): boolean {
        if (this.creep.store[RESOURCE_ENERGY] == 0) {
            const link = this.roomNetwork.upgradeSite.link;
            if (link && link.store[RESOURCE_ENERGY] > 0) {
                this.getResourceFrom(link);
            } else {
                const energy = this.getEnergy();
                if (energy) {
                    this.getResource(energy, RESOURCE_ENERGY);
                }
            }
        } else {
            const controller = this.roomNetwork.room.controller;
            if (controller) {
                if (this.creep.pos.inRangeTo(controller, 3)) {
                    this.creep.upgradeController(controller);
                } else {
                    this.creep.goto(controller.pos);
                }
            }
        }

        return true;
    }

    private getEnergy(): StructureStorage | StructureTerminal | StructureContainer | Resource | Tombstone | undefined {
        let target: StructureStorage | StructureTerminal | StructureContainer | Resource | Tombstone;

        if (this.roomNetwork.room.storage && this.roomNetwork.room.storage.store[RESOURCE_ENERGY] > 0) {
            target = this.roomNetwork.room.storage;
        } else if (this.roomNetwork.room.terminal && this.roomNetwork.room.terminal.store[RESOURCE_ENERGY] > 0) {
            target = this.roomNetwork.room.terminal;
        } else if (this.roomNetwork.room.find(FIND_DROPPED_RESOURCES).length) {
            target = this.creep.pos.findClosestByRange(this.roomNetwork.room.find(FIND_DROPPED_RESOURCES));
        }

        return target;
    }

    private getResource(target: Structure | Resource | Tombstone, resourceType = RESOURCE_ENERGY as ResourceConstant,
                        amount?: number): ScreepsReturnCode {
        if (target instanceof StructureStorage || target instanceof StructureTerminal 
            || target instanceof StructureContainer) {
            const minAmount = Math.min(target.store[resourceType], this.creep.store.getFreeCapacity(), amount);
            return this.creep.withdrawFrom(target, resourceType, minAmount);
        } else if (target instanceof Resource) {
            if (this.creep.pos.isNearTo(target)) {
                this.creep.pickup(target);
            } else {
                this.creep.goto(target.pos);
            }
        }
        return OK;
    }

    private getResourceFrom(target: Structure | Resource | Tombstone | Ruin, resourceType = RESOURCE_ENERGY as ResourceConstant,
                            amount?: number): ScreepsReturnCode {
        if (this.creep.pos.isNearTo(target)) {
            if (target instanceof Tombstone || target instanceof Ruin) {
                const minAmount = Math.min(target.store[resourceType], this.creep.store.getFreeCapacity(), amount);
                this.creep.withdraw(target, resourceType, minAmount);
            } else if (target instanceof Resource) {
                this.creep.pickup(target);
            } else if ( target instanceof StructureStorage
                        || target instanceof StructureTerminal
                        || target instanceof StructureContainer
                        || target instanceof StructureLink) {
                const minAmount = Math.min(target.store[resourceType], this.creep.store.getFreeCapacity(), amount);
                this.creep.withdraw(target, resourceType, minAmount);
            }
        } else {
            this.creep.goto(target.pos);
            return ERR_NOT_IN_RANGE;
        }
    }

    // TODO:
    // init(): void {

    // }

    // work(): void {

    // }

    // private updateTask(): void {
        
    // }
}