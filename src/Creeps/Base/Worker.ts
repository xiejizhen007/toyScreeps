import { Role } from "Creeps/Role";
import { TaskType } from "Creeps/setting";
import { Task } from "Creeps/Task/Task";
import { Tasks } from "Creeps/Task/Tasks";
import { Global } from "Global/Global";

export class Worker extends Role {

    constructionSites: ConstructionSite[];

    init(): void {
        this.registerObjects();
    }

    work(): void {
        this.handleTask(this);
        if (this.task) {
            this.task.autoWork();
        }
    }

    private registerObjects(): void {
        this.constructionSites = this.roomNetwork.constructionSites;
    }

    private buildAction(creep: Role): boolean {
        if (this.constructionSites.length > 0) {
            if (creep.task && creep.task.taskName == TaskType.build && creep.task.isValidTarget()) {
                return true;
            } else {
                const closest = creep.pos.findClosestByRange(this.constructionSites);
                creep.task = Tasks.build(closest);
                return true;
            }
        }

        return false;
    }

    private handleTask(creep: Role): void {
        if (creep.store[RESOURCE_ENERGY] > 0) {
            if (this.constructionSites.length > 0) {
                if (this.buildAction(creep)) return;
            }


        } else {
            const energy = this.findResource(creep);
            if (energy) {
                if (energy instanceof Resource) {
                    // creep.task = Tasks.pickup(energy);
                    if (creep.task && creep.task.taskName != TaskType.pickup) {
                        creep.task.fork(Tasks.pickup(energy));
                        console.log('new task');
                    } else {
                        creep.task = Tasks.pickup(energy);
                    }

                    if (creep.task) {
                        // console.log(creep.task.taskName + ' parent: ' + creep.task.parent ? creep.task.parent.taskName : 'no');
                        if (creep.task.parent) {
                            console.log(creep.task.taskName + ' parent: ' + creep.task.parent.taskName);
                            console.log(creep.memory.task._parent.name + ' child is ' + creep.memory.task.name);
                            // console.log('creep task parent\'s memory: ' + creep.task.parent.memory.name);
                            // creep.memory.task = creep.task.memory;
                        } else {
                            console.log(creep.task.taskName + ' parent: ' + 'no');
                        }

                        // console.log('creep meomry: ' + creep.creep.memory.task._parent);
                    }
                }
            }
        }
    }

    private findResource(creep: Role, resourceType: ResourceConstant = RESOURCE_ENERGY): Structure | Resource {
        const resources = creep.room.find(FIND_DROPPED_RESOURCES);
        if (resources.length > 0) {
            return creep.pos.findClosestByRange(resources);
        }
    }
}