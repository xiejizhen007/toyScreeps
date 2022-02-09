import { Harvester } from "Creeps/Base/Harvester";
import { Queen } from "Creeps/Base/Queen";
import { Role } from "Creeps/Role";
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

            if (creep.memory.role == 'harvester') {
                const role = new Harvester(creep.name, this.roomNetwork);
                this.roles.push(role);
            }
        }

        _.forEach(this.roles, r => r.init());
    }

    work(): void {
        this.spawnQueen();
        this.spawnHarvester();

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
                role: 'queen',
                setup: {
                    body: [CARRY, MOVE],
                    limit: 5,
                    ordered: true,
                },
                priority: 0,
            });
            console.log('need spawn queen');
        }
    }

    private spawnHarvester(): void {
        const target = _.find(this.roomNetwork.memory.networks.sources, f => {
            return f.timeout > 300;
        });

        if (target) {
            this.roomNetwork.spawnNetwork.registerCreep({
                role: 'harvester',
                setup: {
                    body: [WORK, CARRY, MOVE],
                    limit: 6,
                    ordered: false,
                },
                priority: 0,
            });
        }
    }
}