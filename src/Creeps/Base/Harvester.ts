import { Role } from "Creeps/Role";
import { TaskType } from "Creeps/setting";
import { Roles } from "Creeps/setups";

export class Harvester extends Role {
    init(): void {
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
            this.creep.memory.tempTask = {
                type: 'harveste',
                target: target.sourceId
            }
        }
    }

    work(): void {
        if (this.creep.spawning) {
            return;
        }

        if (this.creep.memory.tempTask) {
            const source = Game.getObjectById(this.creep.memory.tempTask.target as Id<Source>);
            const sourceNetwork = this.roomNetwork.sourceNetworks[source.id];
            if (!source || !sourceNetwork) {
                return;
            }

            const amount = this.creep.getActiveBodyparts('work') * 2;

            if (this.creep.store.getFreeCapacity() < amount) {
                if (sourceNetwork.link) {
                    if (this.creep.pos.isNearTo(sourceNetwork.link)) {
                        this.creep.transfer(sourceNetwork.link, RESOURCE_ENERGY);
                    } else {
                        this.creep.goto(sourceNetwork.link.pos);
                        return;
                    }
                } else {
                    this.creep.drop(RESOURCE_ENERGY);
                }
            } 

            if (this.creep.pos.isNearTo(source)) {
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

    finish(): void {

    }
}