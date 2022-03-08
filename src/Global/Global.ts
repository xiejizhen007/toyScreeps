import { Role } from "Creeps/Role";
import { Mem } from "Mem";
import { Market } from "Network/Market";
import { RoomNetwork } from "Network/RoomNetwork";
import { TerminalNetwork } from "Network/TerminalNetwork";

export class Global {
    static roomNetworks: { [roomName: string]: RoomNetwork } = {};
    static roles: { [name: string]: Role } = {};
    static terminalNetwork: TerminalNetwork;
    static market: Market;

    /**
     * 从 origin room 发起对 target room 的殖民
     * @param origin 起始房间
     * @param target 目标房间
     */
    static registerClaimRoom(origin: string, target: string) {
        const originRoom = this.roomNetworks[origin];
        if (originRoom) {
            Mem.wrap(originRoom.memory, 'colony', {
                origin: origin,
                target: target
            });
        }
    }
}