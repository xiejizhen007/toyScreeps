import { RoomNetwork } from 'Network/RoomNetwork';
import { errorMapper } from './modules/errorMapper'

import './Prototypes/Mount';

export const loop = errorMapper(() => {
    initMemory();

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
            roomNetwork.init();
            
            roomNetwork.work();
        }
    }

    let cpuEnd = Game.cpu.getUsed();
    
    if (Game.time % 5 == 0) {
        console.log('cpu used: ' + (cpuEnd - cpuStart));
    }
});

function initMemory(): void {
    if (!Memory.constructionSites) {
        Memory.constructionSites = {};
    }
}