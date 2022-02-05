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
        this.linkWork();
        this.powerSpawnWork();
    }

    private powerSpawnWork(): void {
        if (this.powerSpawn) {
            if (this.powerSpawn.store[RESOURCE_ENERGY] >= 50 && this.powerSpawn.store[RESOURCE_POWER] >= 1) {
                this.powerSpawn.generatePower();
            } else {
                const resourceType = this.powerSpawn.store[RESOURCE_ENERGY] <= this.powerSpawn.store[RESOURCE_POWER] * 50 ? RESOURCE_ENERGY : RESOURCE_POWER;
                this.transportNetwork.requestInput(this.powerSpawn, {
                    reosurceType: resourceType,
                });
            }
        }
    }

    private linkWork(): void {
        if (this.link && this.link.cooldown <= 1 && this.link.store[RESOURCE_ENERGY] < 0.9 * this.link.store.getCapacity(RESOURCE_ENERGY)) {
            if (this.roomNetwork.linkNetwork.receiveLinks.length > 0) {
                this.transportNetwork.requestInput(this.link, {});
            }
        }
    }
}