import { RoomNetwork } from "./RoomNetwork";

export class CommandCenter {
    roomNetwork: RoomNetwork;

    storage?: StructureStorage;
    terminal?: StructureTerminal;
    factory?: StructureFactory;
    spawn?: StructureSpawn;
    link?: StructureLink;
    nuker?: StructureNuker;
    observer?: StructureObserver;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;

        this.storage = roomNetwork.room.storage;
        this.terminal = roomNetwork.room.terminal;
        // this.factory = _.find(this.roomNetwork.room.structures, f => f.structureType == STRUCTURE_FACTORY) as StructureFactory;
        this.factory = roomNetwork.room.factory;
        
        this.spawn = this.storage.pos.findClosestByLimitedRange(this.roomNetwork.spawns, 2);
        this.link = this.storage.pos.findClosestByLimitedRange(this.roomNetwork.links, 2);
    }

    init(): void {

    }

    work(): void {
        
    }
}