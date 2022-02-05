import { RoomNetwork } from "Network/RoomNetwork/RoomNetwork";

export class Queen {
    creep: Creep;
    roomNetwork: RoomNetwork;

    constructor(roomNetwork: RoomNetwork, name: string) {
        this.creep = Game.creeps[name];
        this.roomNetwork = roomNetwork;
    }

    work(): void {

    }

    
}