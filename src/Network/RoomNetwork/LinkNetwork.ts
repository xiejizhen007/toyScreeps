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
        return this.receiveLinks.push(link);
    }

    public requestTransport(link: StructureLink): number {
        return this.transportLinks.push(link);
    }

    public init(): void {

    }

    public work(): void {
        // 向需要接收能量的 link 发送能量
        for (const receiveLink of this.receiveLinks) {
            const closestTransportLink = receiveLink.pos.findClosestByRange(this.transportLinks);
            if (closestTransportLink) {
                const amount = _.min([closestTransportLink.store[RESOURCE_ENERGY], receiveLink.store.getFreeCapacity(RESOURCE_ENERGY)]);
                closestTransportLink.transferEnergy(receiveLink, amount);
                // 发送的 link 陷入冷却，移除以免卡住
                _.remove(this.transportLinks, link => link == closestTransportLink);
            }
        }
        // TODO: 发往 CenterNetwork
    }
}