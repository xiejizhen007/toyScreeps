// 引入外部依赖
import { roleBuilder } from 'role/role.builder';
import { creepLab } from 'role/role.creepLab';
import { roleKing } from 'role/role.king';
import { roleRepairer } from 'role/role.repairer';
import { roleUpgrader } from 'role/role.upgrader';
import { boostClear, Lab } from 'structure/labs';
import { Tower } from 'structure/tower';
import { errorMapper } from './modules/errorMapper'
import { roleHarvester } from './role/role.harvester';
import { roleOutputer } from './role/role.outputer';
import { roleQueen } from './role/role.queen';
import { roleTransfer } from './role/role.transfer';
import { newCreep } from './utils';

import { BOOST_RESOURCE, LAB_TRANSFER_TASK } from './setting';
// import { transfer } from 'creep/transfer';
import { powerSpawnRun } from 'structure/powerSpawn';
import { creepPS } from 'role/role.creepPS';
import mountWork from './mount'

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
            roleHarvester.run(creep);
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
            // creep.hello();
        }
        // else if (creep.memory.role == 'creepTransfer') {
        //     transfer(creep);   
        // }
        else if (creep.memory.role == 'creepPS') {
            creepPS(creep);
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
        Lab.run(room);
        powerSpawnRun(room);
    }

    if (Game.cpu.bucket >= 10000) {
        console.log('generating pixel');
        Game.cpu.generatePixel();
    }

    Tower.run();

    // for (const i in BOOST_RESOURCE['war']) {
    //     console.log(BOOST_RESOURCE['war'][i]);
    // }
});

