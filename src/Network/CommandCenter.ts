import { Priority } from "setting";
import { RoomNetwork } from "./RoomNetwork";
import { TransportNetwork } from "./TransportNetwork";

export class CommandCenter {
    roomNetwork: RoomNetwork;

    storage?: StructureStorage;
    terminal?: StructureTerminal;
    factory?: StructureFactory;
    spawn?: StructureSpawn;
    link?: StructureLink;
    nuker?: StructureNuker;
    observer?: StructureObserver;
    pos: RoomPosition;

    transportNetwork: TransportNetwork;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;

        this.storage = roomNetwork.room.storage;
        this.pos = new RoomPosition(this.storage.pos.x + 1, this.storage.pos.y, this.storage.pos.roomName);
        this.terminal = roomNetwork.room.terminal;
        // this.factory = _.find(this.roomNetwork.room.structures, f => f.structureType == STRUCTURE_FACTORY) as StructureFactory;
        this.factory = roomNetwork.room.factory;
        
        this.spawn = this.storage.pos.findClosestByLimitedRange(this.roomNetwork.spawns, 2);
        this.link = this.storage.pos.findClosestByLimitedRange(this.roomNetwork.links, 2);

        this.transportNetwork = new TransportNetwork;
    }

    init(): void {
        this.registerLinkRequests();
        this.registerRequests();
    }

    work(): void {
        
    }

    private registerLinkRequests(): void {
        if (this.link) {
            if (this.link.store[RESOURCE_ENERGY] > 700) {
                this.roomNetwork.linkNetwork.registerSend(this.link);
            }
        }
    }

    private registerRequests(): void {
        if (this.link && this.link.store[RESOURCE_ENERGY] < 0.9 * this.link.store.getCapacity(RESOURCE_ENERGY) && this.link.cooldown <= 1) {
            if (this.roomNetwork.linkNetwork.receiveLinks.length > 0) {
                this.transportNetwork.requestInput(this.link, Priority.High);
            }
        }

        if (this.link && this.link.store[RESOURCE_ENERGY] > 0) {
            if (this.roomNetwork.linkNetwork.receiveLinks.length == 0) {
                this.transportNetwork.requestOutput(this.link, Priority.NormalHigh);
            }
        }
    }
}