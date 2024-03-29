import { Harvester } from "Creeps/Base/Harvester";
import { King } from "Creeps/Base/King";
import { Miner } from "Creeps/Base/Miner";
import { Queen } from "Creeps/Base/Queen";
import { TestTransfer } from "Creeps/Base/Test";
import { Transfer } from "Creeps/Base/Transfer";
import { Upgrader } from "Creeps/Base/Upgrader";
import { Worker } from "Creeps/Base/Worker";
import { Claimer } from "Creeps/Remote/Claimer";
import { PBAttack } from "Creeps/Remote/PBAttack";
import { PBHeal } from "Creeps/Remote/PBHeal";
import { PBTransfer } from "Creeps/Remote/PBTrasfer";
import { Pioneer } from "Creeps/Remote/Pionner";
import { DirectiveType } from "Directives/types";
import { Market } from "Network/Market";
import { RoomNetwork } from "Network/RoomNetwork";
import { TerminalNetwork } from "Network/TerminalNetwork";
import { PCOperator } from "PowerCreeps/PCOperator";
import { Observer } from "./Observer";

/**
 * 全局对象，缓存对象
 */
export class _Kernel implements IKernel {
    roles: { [creepName: string]: any; };
    roomNetworks: { [roomName: string]: any; };
    powerCreeps: { [creepName: string]: any; };
    directives: { [flagName: string]: any; };

    terminalNetwork: ITerminalNetwork;
    market: IMarket;
    observer: IObserver;

    constructor() {
        // 构建对象
    }

    build(): void {
        this.roles = {};
        this.roomNetworks = {};
        this.powerCreeps = {};
        this.directives = {};

        let terminals = [];

        for (const name in Game.rooms) {
            const room = Game.rooms[name];
            if (room && room.controller && room.controller.my) {
                this.roomNetworks[name] = new RoomNetwork(room);
                if (room.terminal) {
                    terminals.push(room.terminal);
                }
            }
        }

        this.terminalNetwork = new TerminalNetwork(terminals);
        this.market = new Market();
        this.observer = new Observer();

        for (const name in Game.flags) {
            const directive = DirectiveType(Game.flags[name]);
        }

        for (const creepName in Game.creeps) {
            const creep = Game.creeps[creepName];
            if (!creep) {
                continue;
            }

            if (creep.memory.role == 'queen') {
                const role = new Queen(creep);
                this.roles[creepName] = role;
            }

            else if (creep.memory.role == 'harvester') {
                const role = new Harvester(creep);
                this.roles[creepName] = role;
            }

            else if (creep.memory.role == 'upgrader') {
                const role = new Upgrader(creep);
                this.roles[creepName] = role;
            }

            else if (creep.memory.role == 'worker') {
                const role = new Worker(creep);
                this.roles[creepName] = role;
            }

            else if (creep.memory.role == 'king') {
                const role = new King(creep);
                this.roles[creepName] = role;
            }

            else if (creep.memory.role == 'miner') {
                const role = new Miner(creep);
                this.roles[creepName] = role;
            }

            else if (creep.memory.role == 'transfer') {
                const role = new Transfer(creep);
                this.roles[creepName] = role;
            } 

            else if (creep.memory.role == 'claimer') {
                const role = new Claimer(creep);
                this.roles[creepName] = role;
            }

            else if (creep.memory.role == 'pioneer') {
                const role = new Pioneer(creep);
                this.roles[creepName] = role;
            }

            else if (creep.memory.role == 'test') {
                this.roles[creepName] = new TestTransfer(creep);
            }

            else if (creep.memory.role == 'pb_attack') {
                this.roles[creepName] = new PBAttack(creep);
            }
            
            else if (creep.memory.role == 'pb_heal') {
                this.roles[creepName] = new PBHeal(creep);
            }
            
            else if (creep.memory.role == 'pb_transfer') {
                this.roles[creepName] = new PBTransfer(creep);
            }
        }

        for (const creepName in Game.powerCreeps) {
            const pc = Game.powerCreeps[creepName];
            if (pc && pc.ticksToLive) {
                const operator = new PCOperator(pc);
                this.powerCreeps[creepName] = operator;
            }
        }
    }

    refresh(): void {
        
    }

    init(): void {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        if (this.observer) {
            this.observer.init();
        }

        for (const name in this.roomNetworks) {
            if (this.roomNetworks[name]) {
                this.roomNetworks[name].init();
            } else {
                delete this.roomNetworks[name];
            }
        }

        for (const name in this.roles) {
            if (this.roles[name]) {
                this.roles[name].init();
            } else {
                delete this.roles[name];
            }
        }

        for (const name in this.powerCreeps) {
            if (this.powerCreeps[name]) {
                this.powerCreeps[name].init();
            } else {
                delete this.powerCreeps[name];
            }
        }

        if (this.terminalNetwork) {
            this.terminalNetwork.init();
        }

        if (this.market) {
            this.market.init();
        }

    }

    work(): void {
        for (const name in this.roomNetworks) {
            if (this.roomNetworks[name]) {
                this.roomNetworks[name].work();
            } else {
                delete this.roomNetworks[name];
            }
        }

        for (const name in this.roles) {
            if (this.roles[name]) {
                this.roles[name].work();
            } else {
                delete this.roles[name];
            }
        }
        
        for (const name in this.powerCreeps) {
            if (this.powerCreeps[name]) {
                this.powerCreeps[name].work();
            } else {
                delete this.powerCreeps[name];
            }
        }

        if (this.terminalNetwork) {
            this.terminalNetwork.work();
        }

        if (this.market) {
            this.market.work();
        }

        if (this.observer) {
            this.observer.work();
        }
    }

    finish(): void {
        for (const name in this.roles) {
            if (this.roles[name] && this.roles[name].finish) {
                this.roles[name].finish();
            } else {
                delete this.roles[name];
            }
        }

        if (this.terminalNetwork) {
            this.terminalNetwork.finish();
        }

        if (this.market) {
            this.market.finish();
        }

        if (this.observer) {
            this.observer.finish();
        }
    }
}