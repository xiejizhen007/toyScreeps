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
import { addBoostRole, getBodyArray, getCreepBodys, newCreep, roomWork, sell } from './utils';

import { bodyArray, BOOST_RESOURCE, BOOST_RESOURCE_TYPE, LAB_TRANSFER_TASK, roomSpawn } from './setting';
// import { transfer } from 'creep/transfer';
// import { powerSpawnRun } from 'structure/powerSpawn';
import { creepPS } from 'role/role.creepPS';
import mountWork from './mount'
import { harvesterRoom } from 'role/harvesterRoom';
import { roleHarvesterMineral } from 'role/role.harvesterMineral';

import { addRoleSpawnTask } from './utils';
import { transferRoom } from 'role/transferRoom';
import { reserverRoom } from 'role/reserver';
import { Queen } from 'role/queen';

import { BaseUpgrader, RoleHarvester } from 'role/base';
import { RoleTmp } from 'role/tmp';
import { Claimer, Pioneer, RemoteDeposit, RemoteHarvester, RemoteSoldier, Signer } from 'role/remote';

export const loop = errorMapper(() => {
    mountWork();

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (let name in Memory.rooms) {
        if (!Game.rooms[name]) {
            delete Memory.rooms[name];
            console.log('clear room memory: ', name);
        }
    }


    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            // let startCpu = Game.cpu.getUsed();
            let creep_ = new RoleHarvester(creep);
            // console.log('cpu cost: ' + (Game.cpu.getUsed() - startCpu));
            creep_.work();
            // console.log('cpu cost: ' + (Game.cpu.getUsed() - startCpu));
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
            // roleUpgrader.run(creep);
            let creep_ = new BaseUpgrader(creep);
            creep_.work();
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
            let creep_ = new harvesterRoom(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'reserver') {
            reserverRoom(creep);
        }
        else if (creep.memory.role == 'tmp') {
            let creep_ = new Queen(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'farmove' || creep.memory.role == 'pioneer') {
            let creep_ = new Pioneer(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'claimer') {
            let creep_ = new Claimer(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'remoteSoldier') {
            let creep_ = new RemoteSoldier(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'signer') {
            let creep_ = new Signer(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'deposit') {
            let creep_ = new RemoteDeposit(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'test') {
            creep.boost();
        }
    }

    newCreep();

    for (let name in Game.powerCreeps) {
        let powerCreep = Game.powerCreeps[name];
        if (powerCreep) {
            powerCreep.work();
        }
    }

    // for (let name in Game.rooms) {
    //     let room = Game.rooms[name];
        
    //     // powerSpawn 
    //     let powerSpawn = Game.getObjectById<StructurePowerSpawn>(room.memory.powerSpawnID);
    //     if (powerSpawn) {
    //         powerSpawn.generatePower();
    //     }
    //     else if (room.controller && room.controller.my && room.controller.level == 8) {
    //         let powerSpawns = room.find(FIND_STRUCTURES, {
    //             filter: (structure) => {
    //                 return structure.structureType == STRUCTURE_POWER_SPAWN;
    //             }
    //         });

    //         if (powerSpawns.length > 0) {
    //             powerSpawn = powerSpawns[0] as StructurePowerSpawn;
    //             room.memory.powerSpawnID = powerSpawn.id;
    //         }
    //     }

    //     // Lab.run(room);
    //     // powerSpawnRun(room);
        
    //     room.powerWork();

    //     room.buyPower();
    //     const towers = room.find(FIND_STRUCTURES, {
    //         filter: s => s.structureType == STRUCTURE_TOWER
    //     }) as StructureTower[];
    //     towers.forEach(s => s.work());
    // }

    roomWork();

    if (Game.cpu.bucket >= 10000) {
        console.log('generating pixel');
        Game.cpu.generatePixel();
    }

    // console.log("boostType: " + BOOST_RESOURCE_TYPE["attack"][0]);

    // console.log(roomSpawn[6].tmp);
    // console.log(getCreepBodys(roomSpawn[6].tmp));
    // Tower.run();
    // console.log(bodyArray['harvester'][0][MOVE]);
    // console.log(bodyArray['queen'][6][CARRY]);
    // getBodyArray(bodyArray['queen'][6]);
});


// addRoleSpawnTask(role: string, roomName: string, isNeeded?: boolean, workRoomName?: string, flagName?: string)
global._spawn = addRoleSpawnTask;
global._spawnBoost = addBoostRole;
global._sell = sell;