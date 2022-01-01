import { RoomNetwork } from "./RoomNetwork";
import { TransportNetwork } from "./TransportNetwork";

export class CenterNetwork {
    roomNetwork: RoomNetwork;

    link: StructureLink;
    storage: StructureStorage;
    terminal: StructureTerminal;
    factory: StructureFactory;

    nuker: StructureNuker;
    observer: StructureObserver;
    powerSpawn: StructurePowerSpawn;

    transportNetwork: TransportNetwork;

    constructor(roomNetwork: RoomNetwork, storage: StructureStorage) {
        this.roomNetwork = roomNetwork;
        this.storage = storage;
        this.terminal = roomNetwork.terminal;
        this.factory = roomNetwork.factory;
        this.nuker = roomNetwork.nuker;
        this.observer = roomNetwork.observer;
        this.powerSpawn = roomNetwork.powerSpawn;
        this.link = storage.pos.findInRange(this.roomNetwork.availableLinks, 2)[0];

        this.transportNetwork = new TransportNetwork();
    }

    refresh(): void {

    }

    spawnNetworkCreep(): void {
        
    }

    init(): void {

    }

    work(): void {

    }
}