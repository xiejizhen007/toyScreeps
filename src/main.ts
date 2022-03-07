import { Global } from 'Global/Global';
import { RoomNetwork } from 'Network/RoomNetwork';
import { errorMapper } from './modules/errorMapper'

import './Prototypes/Mount';
import { mountPrototype } from './Prototypes/Mount';

import './Global/mountGlobal'; 

export const loop = errorMapper(() => {
    // console.log('loop begin -----------------');

    if (Game.cpu.bucket >= 10000) {
        Game.cpu.generatePixel();
    }

    initMemory();

    mountPrototype();

    let cpuStart = Game.cpu.getUsed();
    for (const creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
        }
    }

    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room && room.controller && room.controller.my) {
            const roomNetwork = new RoomNetwork(Game.rooms[roomName]);
            Global.roomNetworks[roomName] = roomNetwork;
            roomNetwork.init();
            
            roomNetwork.work();
        }
    }
    
    // console.log('room network is still alive');

    let i = 0;
    for (const role in Global.roles) {
        if (Game.creeps[role]) {
            const creep = Global.roles[role];
            creep.init();
            creep.work();
            i++;
        }
        else {
            Global.roles[role] = null;
        }
    }

    // console.log('role : ' + i);

    for (const pcName in Game.powerCreeps) {
        const pc = Game.powerCreeps[pcName];
        if (pc) {
            pc.work();
        }
    }

    let cpuEnd = Game.cpu.getUsed();
    
    if (Game.time % 5 == 0) {
        console.log('cpu used: ' + (cpuEnd - cpuStart));
    }

    // console.log('loop end -----------------');
});

function initMemory(): void {
    if (!Memory.constructionSites) {
        Memory.constructionSites = {};
    }
}