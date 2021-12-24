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