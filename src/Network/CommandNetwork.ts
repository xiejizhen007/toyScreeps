import { RoomNetwork } from "./RoomNetwork";

export class CommandNetwork {
    roomNetwork: RoomNetwork;

    storage?: StructureStorage;
    terminal?: StructureTerminal;
    factory?: StructureFactory;
    link?: StructureLink;
    nuker?: StructureNuker;
    observer?: StructureObserver;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;

        this.storage = roomNetwork.room.storage;
        this.terminal = roomNetwork.room.terminal;
        this.factory = _.find(this.roomNetwork.room.structures, f => f.structureType == STRUCTURE_FACTORY) as StructureFactory;
        
    }
}