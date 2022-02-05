import { RoomNetwork } from "Network/RoomNetwork/RoomNetwork";
import { MEMORY } from "setting";

export class Cache {
    static init(): void {
        if (!Memory[MEMORY.ROOM_NETWORK]) {
            Memory[MEMORY.ROOM_NETWORK] = {};
        }
    }

    static wrap(memory: any, name: string, defaults = {}, deep = false): void {
        if (!memory[name]) {
            memory[name] = _.clone(defaults);
        }

        if (deep) {
            _.defaultsDeep(memory[name])
        } else {
            _.defaults(memory[name]);
        }

        return memory[name];
    }

    static set(): void {

    }

    static setRoomNetworkData(roomName: string, name: string, data: any): void {
        if (!Memory[MEMORY.ROOM_NETWORK][roomName]) {
            Memory[MEMORY.ROOM_NETWORK][roomName] = {};
        }

        if (!Memory[MEMORY.ROOM_NETWORK][roomName][name]) {
            Memory[MEMORY.ROOM_NETWORK][roomName][name] = {};
        }

        Memory[MEMORY.ROOM_NETWORK][roomName][name] = data;
    }

    static getRoomNetworkData(roomName: string, name: string): any {
        if (!Memory[MEMORY.ROOM_NETWORK][roomName]) {
            Memory[MEMORY.ROOM_NETWORK][roomName] = {};
        }

        if (!Memory[MEMORY.ROOM_NETWORK][roomName][name]) {
            Memory[MEMORY.ROOM_NETWORK][roomName][name] = {};
        }

        
        return Memory[MEMORY.ROOM_NETWORK][roomName][name];
    }
}