// 引入外部依赖
import { roleBuilder } from 'role/role.builder';
import { creepLab } from 'role/role.creepLab';
import { roleKing } from 'role/role.king';
import { roleRepairer } from 'role/role.repairer';
import { roleUpgrader } from 'role/role.upgrader';
import { boostClear, Lab } from 'structure/labs';
import { errorMapper } from './modules/errorMapper'
import { roleHarvester } from './role/role.harvester';
import { roleOutputer } from './role/role.outputer';
import { roleQueen } from './role/role.queen';
import { roleTransfer } from './role/role.transfer';
import { addBoostRole, addPowerBank, buy, checkBuy, getBodyArray, getCreepBodys, newCreep, roomWork, sell } from './utils';

import { bodyArray, BOOST_RESOURCE, BOOST_RESOURCE_TYPE, LAB_TRANSFER_TASK, roomSpawn } from './setting';
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
import { PBAttacker, PBDocter } from 'role/team';
import { Movement } from 'role/Movement';
import { SuperSoldier } from 'role/war/SuperSoldier';
import { SuperDismantle } from 'role/war/Dismantle';
import { superDocter } from 'role/war/Docter';
import { Worker } from 'role/base/Worker';
import { MMemory } from 'Memory';
import { FillNuker } from 'role/tmp/FillNuker';
import { Thief } from 'role/tmp/Thief';

// 
import './room/Room';

export const loop = errorMapper(() => {
    mountWork();

    // for (var name in Memory.creeps) {
    //     if (!Game.creeps[name]) {
    //         delete Memory.creeps[name];
    //         console.log('Clearing non-existing creep memory:', name);
    //     }
    // }
    MMemory.clean();

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
            // creep.boost();
            const flag = Game.flags['Movement'];
            if (flag) {
                // Movement.goTo(creep, flag.pos);
            }
        } 
        else if (creep.memory.role == 'pbAttacker') {
            let creep_ = new PBAttacker(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'pbDocter') {
            let creep_ = new PBDocter(creep);
            creep_.work();
        } 
        else if (creep.memory.role == 'superSoldier') {
            let creep_ = new SuperSoldier(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'superDismantle') {
            let creep_ = new SuperDismantle(creep);
            creep_.work();
        } 
        else if (creep.memory.role == 'superDocter') {
            let creep_ = new superDocter(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'worker') {
            let creep_ = new Worker(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'fillNuker') {
            let creep_ = new FillNuker(creep);
            creep_.work();
        }
        else if (creep.memory.role == 'thief') {
            let creep_ = new Thief(creep);
            creep_.work();
        }
    }

    if (!Memory.attackFlagQueue) {
        Memory.attackFlagQueue = new Array();
    }

    newCreep();

    for (let name in Game.powerCreeps) {
        let powerCreep = Game.powerCreeps[name];
        if (powerCreep) {
            powerCreep.work();
        }
    }

    roomWork();

    if (Game.cpu.bucket >= 10000) {
        console.log('generating pixel');
        Game.cpu.generatePixel();
    }

    // console.log(bodyArray['harvester']);
    const room = Game.rooms['W15N59'];
    // room.creeps;
    // console.log(room.creeps.length);
    // console.log(room.creeps.length);
    // console.log(room.flags.length);
});


// addRoleSpawnTask(role: string, roomName: string, isNeeded?: boolean, workRoomName?: string, flagName?: string)
global._spawn = addRoleSpawnTask;
global._spawnBoost = addBoostRole;
global._sell = sell;
global._buy = buy;
global._checkBuy = checkBuy;
global._addPowerBank = addPowerBank;
global._addWhiteList = MMemory.addWhiteList;
global._removeWhiteList = MMemory.removeWhiteList;
global._addAvoidRoom = MMemory.addAvoidRoom;
global._removeAvoidRoom = MMemory.removeAvoidRoom;