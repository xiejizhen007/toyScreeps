// 引入外部依赖
import { roleBuilder } from 'role/role.builder';
import { creepLab } from 'role/role.creepLab';
import { roleKing } from 'role/role.king';
import { roleRepairer } from 'role/role.repairer';
import { roleUpgrader } from 'role/role.upgrader';
import { boostClear, Lab } from 'structure/labs';
// import { Tower } from 'structure/tower';
import { errorMapper } from './modules/errorMapper'
import { roleHarvester } from './role/role.harvester';
import { roleOutputer } from './role/role.outputer';
import { roleQueen } from './role/role.queen';
import { roleTransfer } from './role/role.transfer';
import { newCreep } from './utils';

import { BOOST_RESOURCE, LAB_TRANSFER_TASK } from './setting';
// import { transfer } from 'creep/transfer';
// import { powerSpawnRun } from 'structure/powerSpawn';
import { creepPS } from 'role/role.creepPS';
import mountWork from './mount'
import { harvesterRoom } from 'role/harvesterRoom';
import { roleHarvesterMineral } from 'role/role.harvesterMineral';

import { addRoleSpawnTask } from './utils';
import { transferRoom } from 'role/transferRoom';
import { reserverRoom } from 'role/reserver';
import { Manager } from 'role/KingAndQueen';

import { RoleHarvester } from 'role/base';
import { RoleTmp } from 'role/tmp';
import { RemoteHarvester, Signer } from 'role/remote';

export const loop = errorMapper(() => {
    mountWork();

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            // roleHarvester.run(creep);
            let creep_ = new RoleHarvester(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'queen') {
            roleQueen.run(creep);
        }
        else if (creep.memory.role == 'outputer') {
            roleOutputer.run(creep);
        }
        else if (creep.memory.role == 'transfer') {
            roleTransfer.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'king') {
            roleKing.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'creepLab') {
            creepLab.run(creep);
        }
        else if (creep.memory.role == 'creepPS') {
            creepPS(creep);
        }
        else if (creep.memory.role == 'harvesterMineral') {
            roleHarvesterMineral.run(creep);
        }
        else if (creep.memory.role == 'transferRoom') {
            transferRoom(creep);
        }
        else if (creep.memory.role && creep.memory.role == 'harvesterRoom') {
            // harvesterRoom(creep);
            let creep_ = new harvesterRoom(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'reserver') {
            reserverRoom(creep);
        }
        else if (creep.memory.role == 'manager') {
            let creep_ = new Manager(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'tmp') {
            let creep_ = new Signer(creep);
            creep_.work();
        }
    }

    newCreep();

    for (let name in Game.powerCreeps) {
        let powerCreep = Game.powerCreeps[name];
        if (powerCreep) {
            powerCreep.work();
        }
    }

    for (let name in Game.rooms) {
        let room = Game.rooms[name];
        
        // powerSpawn 
        let powerSpawn = Game.getObjectById<StructurePowerSpawn>(room.memory.powerSpawnID);
        if (powerSpawn) {
            powerSpawn.generatePower();
        }
        else if (room.controller && room.controller.my && room.controller.level == 8) {
            let powerSpawns = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_POWER_SPAWN;
                }
            });

            if (powerSpawns.length > 0) {
                powerSpawn = powerSpawns[0] as StructurePowerSpawn;
                room.memory.powerSpawnID = powerSpawn.id;
            }
        }

        Lab.run(room);
        // powerSpawnRun(room);
        
        room.powerWork();

        room.buyPower();
        const towers = room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_TOWER
        }) as StructureTower[];
        towers.forEach(s => s.work());
    }

    if (Game.cpu.bucket >= 10000) {
        console.log('generating pixel');
        Game.cpu.generatePixel();
    }

    // Tower.run();
});


// addRoleSpawnTask(role: string, roomName: string, isNeeded?: boolean, workRoomName?: string, flagName?: string)
global._spawn = addRoleSpawnTask;