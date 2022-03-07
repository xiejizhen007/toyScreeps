import { Role } from "Creeps/Role";
import { Mem } from "Mem";
import { RoomNetwork } from "Network/RoomNetwork";

export class Global {
    static roomNetworks: { [roomName: string]: RoomNetwork } = {};
    static roles: { [name: string]: Role } = {};

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