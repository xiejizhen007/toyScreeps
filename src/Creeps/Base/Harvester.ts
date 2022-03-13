import { Role } from "Creeps/Role";
import { TaskType } from "Creeps/setting";
import { Roles } from "Creeps/setups";

export class Harvester extends Role {
    init(): void {
        // if (this.creep.memory.task) {
        //     return;
        // }
        if (this.creep.memory.tempTask) {
            return;
        }

        const sourceMemory = this.roomNetwork.memory.networks.sources;
        const target = _.find(sourceMemory, f => {
            const role = _.find(f.creeps, c => {
                const creep = Game.creeps[c];
                return creep && creep.memory.role == Roles.harvester;
            });
            return f.timeout > 300 || !role
        });

        if (target) {
            target.timeout = 0;
            target.creeps.push(this.creep.name);
            // const source = Game.getObjectById(target.sourceId);
            // this.task = Tasks.harvest(source);
            this.creep.memory.tempTask = {
                type: 'harveste',
                target: target.sourceId
            }
            // this.task = Tasks.harvest(source);
        }
    }

    work(): void {
        if (this.creep.spawning) {
            return;
        }

        // const link = this.pos.findClosestByRange(this.roomNetwork.links);
        // if (link && this.store.getFreeCapacity() == 0) {
        //     const amount = Math.min(link.store.getFreeCapacity(RESOURCE_ENERGY), this.store[RESOURCE_ENERGY]);
        //     // this.task = this.task.fork(Tasks.transfer(link, RESOURCE_ENERGY, amount));
        // }

        // // new task
        // if (this.task) {
        //     // console.log(this.task._target._id);
        //     const target = Game.getObjectById(this.task._target._id as Id<Source> | Id<StructureLink>);
        //     if (this.pos.isNearTo(target)) {
        //         this.task.work();
        //     } else {
        //         this.creep.goto(target.pos);
        //     }
        // }

        if (this.creep.memory.tempTask) {
            const source = Game.getObjectById(this.creep.memory.tempTask.target as Id<Source>);
            const sourceNetwork = this.roomNetwork.sourceNetworks[source.id];
            if (!source || !sourceNetwork) {
                return;
            }

            if (this.creep.store.getFreeCapacity() == 0) {
                if (sourceNetwork.link) {
                    if (this.creep.pos.isNearTo(sourceNetwork.link)) {
                        this.creep.transfer(sourceNetwork.link, RESOURCE_ENERGY);
                    } else {
                        this.creep.goto(sourceNetwork.link.pos);
                    }
                
                    return;
                }

                this.creep.drop(RESOURCE_ENERGY);
            } 

            // if (sourceNetwork.container) {
            //     console.log(sourceNetwork.container);
            // }

            if (this.creep.pos.isNearTo(source)) {
                // if (sourceNetwork.container) {
                //     this.creep.goto(sourceNetwork.container.pos);
                // }
                this.creep.harvest(source);
            } else {
                if (sourceNetwork.container) {
                    this.creep.goto(sourceNetwork.container.pos);
                } else {
                    this.creep.goto(source.pos);
                }
            }
        }
    }
}