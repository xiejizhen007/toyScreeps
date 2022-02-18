import { RoomNetwork } from "./RoomNetwork";

export class LinkNetwork {
    room: Room;
    roomNetwork: RoomNetwork;
    
    receiveLinks: StructureLink[];
    sendLinks: StructureLink[];

    constructor(roomNetwork: RoomNetwork) {
        this.room = roomNetwork.room;
        this.roomNetwork = roomNetwork;

        this.receiveLinks = [];
        this.sendLinks = [];
    }

    init(): void {

    }

    work(): void {
        // console.log('links, ' + this.sendLinks.length);
        for (const receiveLink of this.receiveLinks) {
            const closestSendLink = receiveLink.pos.findClosestByRange(this.sendLinks);
            if (closestSendLink) {
                const amount = _.min([closestSendLink.store[RESOURCE_ENERGY], receiveLink.store.getFreeCapacity()]);
                closestSendLink.transferEnergy(receiveLink, amount);
                _.remove(this.sendLinks, link => link == closestSendLink);
            }
        }

        if (this.roomNetwork.commandCenter && this.roomNetwork.commandCenter.link) {
            for (const link of this.sendLinks) {
                link.transferEnergy(this.roomNetwork.commandCenter.link);
            }
        }
    }

    registerReceive(link: StructureLink): void {
        this.receiveLinks.push(link);
    }

    registerSend(link: StructureLink): void {
        this.sendLinks.push(link);
    }
}