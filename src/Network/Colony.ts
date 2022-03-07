import { Mem } from "Mem";
import { RoomNetwork } from "./RoomNetwork";

export interface ColonyMemory {
    origin: string;
    target: string;

    owner: string;
    level: number;
}

export const ColonyMemoryDefaults: ColonyMemory = {
    origin: "",
    target: "",

    owner: "",
    level: 0,
}

/**
 * 殖民地的实例
 */
export class Colony {
    origin: string;
    target: string;

    owner: string;
    level: 0;

    memory: ColonyMemory;
    roomNetwork: RoomNetwork;

    constructor(roomNetwork: RoomNetwork, target: string) {
        this.origin = roomNetwork.room.name;
        this.target = target;
        this.roomNetwork = roomNetwork;

        this.memory = Mem.wrap(roomNetwork.memory, 'colony', ColonyMemoryDefaults);
    }

    init() {
        this.memory.origin = this.roomNetwork.room.name;
        this.memory.target = this.target;

        const room = Game.rooms[this.target];
        if (room && room.controller) {
            this.memory.owner = room.controller.owner ? room.controller.owner.username : "";
            this.memory.level = room.controller.level;

            if (room.controller.my && room.controller.level >= 4) {
                delete this.memory;
            }
        }
    }

    work() {
        
    }
}