import { RoomNetwork } from "../RoomNetwork";

export abstract class BaseNetwork {
    roomNetwork: RoomNetwork;
    room: Room;
    pos: RoomPosition;
    memory: any;

    constructor(roomNetwork: RoomNetwork, object: RoomObject, name: string) {
        this.roomNetwork = roomNetwork;
        this.room = object.room!;
        this.pos = object.pos;

        this.roomNetwork.baseNetworks.push(this);
    }

    abstract refresh(): void;

    abstract spawnNetworkCreep(): void;

    abstract init(): void;

    abstract work(): void;
}