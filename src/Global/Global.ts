import { Role } from "Creeps/Role";
import { RoomNetwork } from "Network/RoomNetwork";

export class Global {
    static roomNetworks: { [roomName: string]: RoomNetwork } = {};
    static roles: { [name: string]: Role } = {};

    init(): void {
        // this.roomNetworks = {};
    }
}