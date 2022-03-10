import { Claimer } from "Creeps/Remote/Claimer";
import { Harvester } from "Creeps/Base/Harvester";
import { King } from "Creeps/Base/King";
import { Miner } from "Creeps/Base/Miner";
import { Queen } from "Creeps/Base/Queen";
import { Transfer } from "Creeps/Base/Transfer";
import { Upgrader } from "Creeps/Base/Upgrader";
import { Worker } from "Creeps/Base/Worker";
import { CreepSetup } from "Creeps/CreepSetup";
import { Role } from "Creeps/Role";
import { CreepRolePriority } from "Creeps/setting";
import { Roles, Setups } from "Creeps/setups";
import { RoomNetwork } from "./RoomNetwork";
import { Pioneer } from "Creeps/Remote/Pionner";
import { Test } from "Creeps/Base/Test";

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
                const role = new Queen(creep, this.roomNetwork);
                this.roles.push(role);
            }

            else if (creep.memory.role == 'harvester') {
                const role = new Harvester(creep, this.roomNetwork);
                this.roles.push(role);
            }

            else if (creep.memory.role == 'upgrader') {
                const role = new Upgrader(creep, this.roomNetwork);
                this.roles.push(role);
            }

            else if (creep.memory.role == 'worker') {
                const role = new Worker(creep, this.roomNetwork);
                // Worker
                this.roles.push(role);
            }

            else if (creep.memory.role == 'king') {
                const role = new King(creep, this.roomNetwork);
                this.roles.push(role);
            }

            else if (creep.memory.role == 'miner') {
                const role = new Miner(creep, this.roomNetwork);
                this.roles.push(role);
            }

            else if (creep.memory.role == Roles.transfer) {
                const role = new Transfer(creep, this.roomNetwork);
                this.roles.push(role);
            } 

            else if (creep.memory.role == Roles.claimer) {
                const role = new Claimer(creep, this.roomNetwork);
                this.roles.push(role);
            }

            else if (creep.memory.role == Roles.pionner) {
                if (this.roomNetwork.colony && this.roomNetwork.colony.target) {
                    const role = new Pioneer(creep, this.roomNetwork, this.roomNetwork.colony.target);
                    this.roles.push(role);
                }
            }

            else if (creep.memory.role == Roles.test) {
                const role = new Test(creep, this.roomNetwork);
                this.roles.push(role);
            }
        }

        // _.forEach(this.roles, r => r.init());
    }

    work(): void {
        this.spawnQueen();
        this.spawnHarvester();
        this.spawnUpgrader();
        this.spawnWorker();
        this.spawnKing();
        this.spawnMiner();

        this.spawnTransfer();
        this.spawnClaimer();
        this.spawnPioneer();

        if (this.roomNetwork.room.name == 'W15N59') {
            this.spawnTest();
        }
        // _.forEach(this.roles, r => r.work());
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
            // console.log('spawn queen');
        }
    }

    private spawnHarvester(): void {
        // const amount = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == Roles.harvester);

        // const target = _.find(this.roomNetwork.memory.networks.sources, f => {
        //     const role = _.find(f.creeps, c => Game.creeps[c] && Game.creeps[c].memory.role == Roles.harvester);
        //     return f.timeout > 300 || !role;
        // });

        // if (target) {
        //     this.roomNetwork.spawnNetwork.registerCreep({
        //         setup: Setups.harvester.default,
        //         priority: CreepRolePriority.harvester,
        //     });

        //     console.log('spawn harvester');
        // }

        // console.log('amount: ' + amount.length);

        let needAmount = 0;
        _.forEach(this.roomNetwork.sourceNetworks, s => {
            // if ()
            const target = _.find(s.memory.creeps, c => Game.creeps[c] && Game.creeps[c].memory.role == Roles.harvester);
            if (!target) {
                needAmount++;
            }
        });
        
        // console.log('needAmount: ' + needAmount);

        if (needAmount > 0 && Game.time % 3 == 0) {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.harvester.default,
                priority: CreepRolePriority.harvester,
            });

            // console.log('spawn harvester');
        }
    }

    private spawnUpgrader(): void {
        const target = _.find(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == Roles.upgrader);
        if (!target && this.roomNetwork.room.controller.level < 8) {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.upgrader.default,
                priority: CreepRolePriority.upgrader,
            });
            // console.log('spawn upgrader');
        }
    }

    private spawnWorker(): void {
        const target = _.find(this.roomNetwork.memory.myCreeps, f => {
            return Game.creeps[f] && Game.creeps[f].memory.role == Roles.worker
        });
        if (!target) {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.worker.default,
                priority: CreepRolePriority.worker,
            });
            // console.log('spawn worker');
        }
    }

    private spawnKing(): void {
        const target = _.find(this.roomNetwork.memory.myCreeps, f => {
            return Game.creeps[f] && Game.creeps[f].memory.role == 'king';
        });
        if (target || !this.roomNetwork.commandCenter || !this.roomNetwork.commandCenter.link) {
            // console.log('spawn king no target');
        } else {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.king.default,
                priority: CreepRolePriority.king,
            });
            // console.log('spawn king');
        }
    }

    private spawnMiner(): void {
        if (this.roomNetwork.mineSite && this.roomNetwork.mineSite.mineral.mineralAmount > 0) {
            const target = _.find(this.roomNetwork.memory.myCreeps, f => {
                return Game.creeps[f] && Game.creeps[f].memory.role == 'miner';
            });

            if (!target) {
                this.roomNetwork.spawnNetwork.registerCreep({
                    setup: Setups.miner.default,
                    priority: CreepRolePriority.miner,
                });
            }
        }
    }

    private spawnTransfer(): void {
        // 当前运输者的数量
        const amount = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == Roles.transfer);
        
        // 需要的数量
        let needAmount = 0;
        _.forEach(this.roomNetwork.sourceNetworks, s => {
            if (s.container && !s.link) {
                needAmount++;
            }
        });

        if (this.roomNetwork.mineSite && this.roomNetwork.mineSite.container) {
            needAmount++;
        }

        if (needAmount > amount.length && Game.time % 3 == 0) {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.transfer.default,
                priority: CreepRolePriority.transfer,
            });
        }
    }

    private spawnClaimer(): void {
        if (this.roomNetwork.colony && this.roomNetwork.colony.owner != 'HIM_Xjz') {
            const target = _.find(this.roomNetwork.memory.myCreeps, f => {
                return Game.creeps[f] && Game.creeps[f].memory.role == Roles.claimer;
            });

            if (!target && !this.roomNetwork.colony.owner) {
                if (Game.time % 3 == 0) {
                    this.roomNetwork.spawnNetwork.registerCreep({
                        setup: Setups.claimer.default,
                        priority: CreepRolePriority.transfer,
                    });
                }
            }
        }
    }

    private spawnPioneer(): void {
        if (this.roomNetwork.colony) {
            const target = _.find(this.roomNetwork.memory.myCreeps, f => {
                return Game.creeps[f] && Game.creeps[f].memory.role == Roles.pionner;
            });

            const room = Game.rooms[this.roomNetwork.colony.target];
            const haveSpawn = room ? room.spawns.length > 0 && room.spawns[0].my : false;

            if (!target && !haveSpawn) {
                if (Game.time % 3 == 0) {
                    this.roomNetwork.spawnNetwork.registerCreep({
                        setup: Setups.pioneer.default,
                        priority: CreepRolePriority.transfer,
                    });
                }
            }
        }
    }
    
    private spawnTest(): void {
        const target = _.find(this.roomNetwork.memory.myCreeps, f => {
            return Game.creeps[f] && Game.creeps[f].memory.role == 'test';
        });
        if (target) {
            // console.log('spawn king no target');
        } else {
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.test.default,
                priority: CreepRolePriority.king,
            });
            // console.log('spawn king');
        }
    }
}