import { Harvester } from "Creeps/Base/Harvester";
import { Queen } from "Creeps/Base/Queen";
import { Upgrader } from "Creeps/Base/Upgrader";
import { Worker } from "Creeps/Base/Worker";
import { CreepSetup } from "Creeps/CreepSetup";
import { Role } from "Creeps/Role";
import { CreepRolePriority } from "Creeps/setting";
import { Roles, Setups } from "Creeps/setups";
import { RoomNetwork } from "./RoomNetwork";

export class CreepController {
    roles: Role[];
    roomNetwork: RoomNetwork;

    constructor(roomNetwork: RoomNetwork) {
        this.roles = [];

        this.roomNetwork = roomNetwork;
    }

    init(): void {
        for (const creepName of this.roomNetwork.memory.myCreeps) {
            const creep = Game.creeps[creepName];
            if (!creep) {
                continue;
            }

            if (creep.memory.role == 'queen') {
                const role = new Queen(creep.name, this.roomNetwork);
                this.roles.push(role);
            }

            else if (creep.memory.role == 'harvester') {
                const role = new Harvester(creep.name, this.roomNetwork);
                this.roles.push(role);
            }

            else if (creep.memory.role == 'upgrader') {
                const role = new Upgrader(creep.name, this.roomNetwork);
                this.roles.push(role);
            }

            else if (creep.memory.role == 'worker') {
                const role = new Worker(creep.name, this.roomNetwork);
                // Worker
                this.roles.push(role);
            }
        }

        _.forEach(this.roles, r => r.init());
    }

    work(): void {
        this.spawnQueen();
        this.spawnHarvester();
        this.spawnUpgrader();
        this.spawnWorker();

        _.forEach(this.roles, r => r.work());
    }

    private spawnQueen(): void {
        // const target = _.find(this.roles, f => f.creep.memory.role == 'queen');
        const target = _.find(this.roomNetwork.memory.myCreeps, f => {
            return Game.creeps[f] && Game.creeps[f].memory.role == 'queen';
        });
        if (target) {
            // console.log('have queen');
        } else {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.queen.default,
                priority: CreepRolePriority.queen,
            });
            console.log('need spawn queen');
        }
    }

    private spawnHarvester(): void {
        const target = _.find(this.roomNetwork.memory.networks.sources, f => {
            const role = _.find(f.creeps, c => Game.creeps[c] && Game.creeps[c].memory.role == Roles.harvester);
            return f.timeout > 300 || !role;
        });

        if (target) {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.harvester.default,
                priority: CreepRolePriority.harvester,
            });
        }
    }

    private spawnUpgrader(): void {
        const target = _.find(this.roomNetwork.room.myCreeps, f => f.memory.role == Roles.upgrader);
        if (!target) {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.upgrader.default,
                priority: CreepRolePriority.upgrader,
            });
            console.log('spawn upgrader');
        }
    }

    private spawnWorker(): void {
        const target = _.find(this.roomNetwork.room.myCreeps, f => f.memory.role == Roles.worker);
        if (!target) {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.worker.default,
                priority: CreepRolePriority.worker,
            });
            console.log('spawn worker');
        }
    }
}