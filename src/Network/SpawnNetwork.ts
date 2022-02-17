import { CreepSetup } from "Creeps/CreepSetup";
import { Roles } from "Creeps/setups";
import { RoomNetwork } from "./RoomNetwork";

export interface SpawnRequest {
    setup: CreepSetup;
    priority: number;
    opts?: SpawnRequestOptions;
};

export interface SpawnRequestOptions {
    spawn?: StructureSpawn;
    dir?: DirectionConstant[];
};

export class SpawnNetwork {
    room: Room;
    roomNetwork: RoomNetwork;
    spawns: StructureSpawn[];
    requests: SpawnRequest[];

    constructor(roomNetwork: RoomNetwork) {
        this.room = roomNetwork.room;
        this.roomNetwork = roomNetwork;
        this.spawns = _.filter(this.room.structures, f => f.structureType == STRUCTURE_SPAWN && f.isActive) as StructureSpawn[];

        this.requests = [];
    }

    init(): void {
        if (Game.time % 10 == 0) {
            // this.registerCreep({
            //     role: 'queen', 
            //     setup: {
            //         body: [CARRY, MOVE],
            //         limit: 10,
            //         ordered: true,
            //     },
            //     priority: 0,
            // });
        }
    }

    work(): void {
        // TODO: 能量不足时，跳过
        for (const spawn of this.spawns) {
            if (!spawn.spawning) {
                const minPriority = _.min(this.requests, f => f.priority);
                const request = _.find(this.requests, f => f.priority == minPriority.priority);
                // console.log('i am free ' + spawn);

                if (request) {
                    const energy = request.setup.role == Roles.queen ? this.room.energyAvailable : this.room.energyCapacityAvailable;

                    const ret = spawn.spawnCreep(request.setup.generateBody(energy), request.setup.role + Game.time, {
                        memory: {role: request.setup.role, room: this.room.name, isNeeded: false},
                    });

                    if (ret == OK) {
                        this.roomNetwork.memory.myCreeps.push(request.setup.role + Game.time);
                        _.remove(this.requests, f => f == request);
                    } else {
                        console.log('spawn err: ' + ret);
                    }
                }
            }
        }
    }

    registerCreep(request: SpawnRequest): boolean {
        this.requests.push(request);
        return true;
    }

    // generateBody(setup: CreepBodySetup, availableEnergy: number = this.room.energyCapacityAvailable): BodyPartConstant[] {
    //     const maxEnergy = availableEnergy;
    //     let body: BodyPartConstant[] = [];

    //     const oneCost = _.sum(setup.body, part => BODYPART_COST[part]);
    //     const loop = _.min([Math.floor(maxEnergy / oneCost), setup.limit, Math.floor(50 / setup.body.length)]);

    //     if (setup.ordered) {
    //         for (const part of setup.body) {
    //             for (let i = 0; i < loop; i++) {
    //                 body.push(part);
    //             }
    //         }
    //     } else {
    //         for (let i = 0; i < loop; i++) {
    //             for (const part of setup.body) {
    //                 body.push(part);
    //             }
    //         }
    //     }

    //     return body;
    // }
}