import { Role } from "Creeps/Role";
import { TaskType } from "Creeps/setting";
import { Roles } from "Creeps/setups";
import { Tasks } from "Creeps/Task/Tasks";

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
            const source = Game.getObjectById(target.sourceId);
            this.task = Tasks.harvest(source);
        }

        // const tmp = _.find(sourceMemory, f => {
        //     return _.include(f.creeps, this.creep.name);
        // });

        // // console.log(tmp.pos);
        // if (tmp) {
        //     // console.log(tmp.sourceId);
        //     const source = Game.getObjectById(tmp.sourceId);
        //     this.task = Tasks.harvest(source);
        // }
    }

    work(): void {
        if (this.creep.spawning) {
            return;
        }

        if (this.task) {
            this.task.autoWork();
        }

        // if (!this.creep.memory.task || this.creep.memory.task.type != TaskType.harvest) {
        //     return;
        // }

        // const source = Game.getObjectById(this.creep.memory.task._target.id as Id<Source>);
        // if (source) {
            // if (this.creep.pos.isNearTo(source) && source.energy > 0) {
            //     this.creep.harvest(source);
            // } else {
            //     this.creep.moveTo(source);
            // }
        //     this.task = Tasks.harvest(source);
        //     this.task.creep = this.creep;
        //     this.task.autoWork();
        // } else {
            // this.creep.memory.task.type = TaskType.err;
        // }
        // this.handleTask();
    }
}