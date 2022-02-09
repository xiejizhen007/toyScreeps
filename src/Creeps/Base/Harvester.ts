import { Role } from "Creeps/Role";

export class Harvester extends Role {
    init(): void {
        if (this.creep.memory.task) {
            return;
        }

        const target = _.find(this.roomNetwork.memory.networks.sources, f => {
            return f.timeout > 300;
        });

        if (target) {
            target.timeout = 0;

            if (!this.creep.memory.task) {
                this.creep.memory.task = {
                    type: ''
                };
            }

            this.creep.memory.task.type = 'harveste';
            this.creep.memory.task.target = target.sourceId;
        }
    }

    work(): void {
        if (this.creep.spawning) {
            return;
        }

        if (!this.creep.memory.task || this.creep.memory.task.type != 'harveste') {
            return;
        }

        // 
        // if (this.creep.ticksToLive == 50) {
        //     this.roomNetwork.memory.networks.sources[this.creep.memory.task.target as Id<Source>].timeout = 300;
        // }

        const source = Game.getObjectById(this.creep.memory.task.target as Id<Source>);
        if (source) {
            if (this.creep.pos.isNearTo(source) && source.energy > 0) {
                this.creep.harvest(source);
            } else {
                this.creep.moveTo(source);
            }
        }
    }
}