import { RoomNetwork } from 'Network/RoomNetwork';
import { errorMapper } from './modules/errorMapper'

import './Prototypes/Mount';

export const loop = errorMapper(() => {
    let cpuStart = Game.cpu.getUsed();
    for (const creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
        }
    }

    for (const roomName in Game.rooms) {
        const roomNetwork = new RoomNetwork(Game.rooms[roomName]);
        roomNetwork.init();
        
        roomNetwork.work();
    }

    let cpuEnd = Game.cpu.getUsed();
    console.log('cpu used: ' + (cpuEnd - cpuStart));
});