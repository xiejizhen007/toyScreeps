import { Role } from "Creeps/Role";
import { TaskType } from "Creeps/setting";
import { Roles } from "Creeps/setups";

export class Harvester extends Role {
    init(): void {
        if (this.creep.memory.task) {
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

            if (!this.creep.memory.task) {
                this.creep.memory.task = {
                    type: TaskType.free
                };
            }

            this.creep.memory.task.type = TaskType.harveste;
            this.creep.memory.task.target = target.sourceId;
            this.creep.memory.task.targetPos = target.pos;
        }
    }

    work(): void {
        if (this.creep.spawning) {
            return;
        }

        if (!this.creep.memory.task || this.creep.memory.task.type != TaskType.harveste) {
            return;
        }

        const source = Game.getObjectById(this.creep.memory.task.target as Id<Source>);
        if (source) {
            if (this.creep.pos.isNearTo(source) && source.energy > 0) {
                this.creep.harvest(source);
            } else {
                this.creep.moveTo(source);
            }
        } else {
            this.creep.memory.task.type = TaskType.err;
        }
    }
}