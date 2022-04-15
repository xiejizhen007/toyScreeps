import { Mem } from "Mem";

export interface ObserverMemory {
    plan: string[]; // 计划取 ob 的房间名
    available: {
        tick: number;
        room: string;
    }[];            // 有视野时的 tick，与房间名
}

export const ObserverMemoryDefault: ObserverMemory = {
    plan: [],
    available: [],
}

export class Observer {
    memory: ObserverMemory;
    plan: string[];
    available: {
        tick: number;
        room: string;
    }[];
    
    constructor() {
        this.memory = Mem.wrap(Memory, "observer", ObserverMemoryDefault);
        this.plan = [];
        this.available = [];
    }

    init(): void {
        this.plan = this.memory.plan;
        this.available = this.memory.available;
    }

    work(): void {

    }

    finish(): void {
        this.memory.plan = this.plan;
        this.memory.available = this.available;
    }

    private updateRoomState(roomName: string) {
        if (!Game.rooms[roomName]) {
            return;
        }

        const room = Game.rooms[roomName];
        room.memory.tick = Game.time;
        if (room.controller && room.controller.owner) {
            room.memory.owner = room.controller.owner.username;
            room.memory.level = room.controller.level;
        } else {
            room.memory.owner = "";
            room.memory.level = 0;
        }

        const structures = room.structures;
        if (structures.find(f => f.structureType == STRUCTURE_TOWER)) {
            room.memory.dangerous = true;
        } else {
            room.memory.dangerous = false;
        }

        const bank = structures.find(f => f.structureType == STRUCTURE_POWER_BANK) as StructurePowerBank;
        if (bank) {
            room.memory.power = {
                amount: bank.power,
                decay: bank.ticksToDecay,
                hits: bank.hits
            };
        } else {
            room.memory.power = null;
        }

        const deposit = room.find(FIND_DEPOSITS);
        if (deposit.length) {
            room.memory.deposit = {
                cooldown: deposit[0].lastCooldown,
                decay: deposit[0].ticksToDecay,
                resourceType: deposit[0].depositType,
            };
        } else {
            room.memory.deposit = null;
        }
    }
}