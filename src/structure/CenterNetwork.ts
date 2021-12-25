import { MRoom } from "room/MRoom";

export class CenterNetwork {
    room: MRoom;
    link: StructureLink | undefined;        //
    storage: StructureStorage | undefined;
    terminal: StructureTerminal | undefined;
    nuker: StructureNuker | undefined;
    factory: StructureFactory | undefined;
    powerSpawn: StructurePowerSpawn | undefined;
    observer: StructureObserver | undefined;
    flag: Flag;                             // center flag

    setting: {
        linksTransmitAt: 700,
    }

    constructor(room: MRoom) {
        this.room = room;
        this.storage = room.storage;
        this.terminal = room.terminal;
        this.nuker = room.nuker;
        this.powerSpawn = room.powerSpawn;
        this.factory = room.factory;
        this.observer = room.observer;
        if (this.flag) {
            this.link = this.flag.pos.findInRange(room.links, 1)[0];
        } else if (this.storage) {
            this.link = this.storage.pos.findInRange(room.links, 1)[0];
        }
    }

    private registerLinkTransmitRequests(): void {
        if (this.link) {
            if (this.link.store[RESOURCE_ENERGY] > this.setting.linksTransmitAt) {
                this.room.linkNetwork.requestTransmit(this.link);
            }
        }
    }

    private registerRequests(): void {
        
    }

    init(): void {
        this.registerLinkTransmitRequests();
    }
}