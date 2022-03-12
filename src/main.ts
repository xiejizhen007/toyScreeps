import { Global } from 'Global/Global';
import { RoomNetwork } from 'Network/RoomNetwork';
import { errorMapper } from './modules/errorMapper'

import './Prototypes/Mount';
import { mountPrototype } from './Prototypes/Mount';

import './Global/mountGlobal'; 
import { TerminalNetwork } from 'Network/TerminalNetwork';
import { Mem } from 'Mem';
import { Market } from 'Network/Market';

export const loop = errorMapper(() => {
    // console.log('loop begin -----------------');


    // if (Game.cpu.bucket >= 10000) {
    //     Game.cpu.generatePixel();
    // }

    Memory.global = Mem.wrap(Memory, 'global', {});

    // 创建全局对象

    let terminals: StructureTerminal[] = [];
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room && room.terminal && room.terminal.my && room.terminal.isActive()) {
            terminals.push(room.terminal);
        }
    }

    Global.terminalNetwork = new TerminalNetwork(terminals);
    Global.terminalNetwork.init();
    Global.terminalNetwork.work();

    Global.market = new Market();

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

            // Global.terminalNetwork.avgTerminalResource(room.name);
        }
    }
    
    // console.log('room network is still alive');
    let cpuEnd = Game.cpu.getUsed();
    
    if (Game.time % 5 == 0) {
        console.log('roomNetwork cpu used: ' + (cpuEnd - cpuStart));
    }

    cpuStart = Game.cpu.getUsed();
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

    cpuEnd = Game.cpu.getUsed();
    if (Game.time % 5 == 0) {
        console.log('creep cpu used: ' + (cpuEnd - cpuStart));
    }

    for (const pcName in Game.powerCreeps) {
        const pc = Game.powerCreeps[pcName];
        if (pc) {
            pc.work();
        }
    }

    
    // cpuEnd = Game.cpu.getUsed();
    if (Game.time % 5 == 0) {
        // console.log('all cpu used: ' + (cpuEnd - cpuStart));
    }

    // console.log('loop end -----------------');
});

function initMemory(): void {
    if (!Memory.constructionSites) {
        Memory.constructionSites = {};
    }
}