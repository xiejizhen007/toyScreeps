import { RoomNetwork } from "Network/RoomNetwork";

export abstract class Role {
    creep: Creep;
    roomNetwork: RoomNetwork;

    constructor(name: string, roomNetwork: RoomNetwork) {
        this.creep = Game.creeps[name];
        this.roomNetwork = roomNetwork;
    }

    abstract init(): void;
    abstract work(): void;
}