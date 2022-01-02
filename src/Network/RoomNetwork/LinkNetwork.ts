import { RoomNetwork } from "./RoomNetwork";

export class LinkNetwork {
    roomNetwork: RoomNetwork;
    receiveLinks: StructureLink[];
    transportLinks: StructureLink[];

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.receiveLinks = [];
        this.transportLinks = [];
    }

    public refrash(): void {
        this.receiveLinks = [];
        this.transportLinks = [];
    }

    public requestReceive(link: StructureLink): number {
        console.log('requestReceive');
        return this.receiveLinks.push(link);
    }

    public requestTransport(link: StructureLink): number {
        console.log('requestTransport');
        return this.transportLinks.push(link);
    }

    public claimLink(link: StructureLink | undefined): void {
        if (link) {
            _.remove(this.roomNetwork.availableLinks, l => l.id == link.id);
        }
    }

    public init(): void {

    }

    public work(): void {
        console.log('link work');
        console.log('link transport size: ' + this.transportLinks.length);
        console.log('link receive size: ' + this.receiveLinks.length);

        // 向需要接收能量的 link 发送能量
        for (const receiveLink of this.receiveLinks) {
            const closestTransportLink = receiveLink.pos.findClosestByRange(this.transportLinks);
            console.log('should transfer link');
            if (closestTransportLink) {
                console.log('transfer link');
                const amount = _.min([closestTransportLink.store[RESOURCE_ENERGY], receiveLink.store.getFreeCapacity(RESOURCE_ENERGY)]);
                closestTransportLink.transferEnergy(receiveLink, amount);
                // 发送的 link 陷入冷却，移除以免卡住
                _.remove(this.transportLinks, link => link.id == closestTransportLink.id);
            }
        }
        // TODO: 发往 CenterNetwork
        if (this.roomNetwork.centerNetwork && this.roomNetwork.centerNetwork.link) {
            const centerLink = this.roomNetwork.centerNetwork.link;
            for (const transportLink of this.transportLinks) {
                transportLink.transferEnergy(centerLink);
            }
        }

    }
}