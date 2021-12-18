export class LinkNetwork {
    room: Room;                 // 当前网络服务房间
    receive: StructureLink[];   // 接收方
    transmit: StructureLink[];  // 发送方

    constructor(room: Room) {
        this.room = room;
        this.receive = [];
        this.transmit = [];
    }

    init(): void {

    }

    work(): void {
        for (const receiveLink of this.receive) {
            // 接收方找到离自己最近的发送方
            const closestTransmitLink = receiveLink.pos.findClosestByRange(this.transmit);
            if (closestTransmitLink) {
                const amount = _.min([receiveLink.store[RESOURCE_ENERGY], receiveLink.store.getFreeCapacity(RESOURCE_ENERGY)]);
                closestTransmitLink.transferEnergy(receiveLink, amount);
                // 最近的发送方已经发送过能量了，在冷却中，已经失去工作能力了
                _.remove(this.transmit, link => link == closestTransmitLink);
            }
        }

        for (const transmitLink of this.transmit) {
            // TODO: 剩余的发送方送给中央集群

        }
    }

    refresh(): void {
        this.receive = [];
        this.transmit = [];
    }

    requestReceive(link: StructureLink): void {
        this.receive.push(link);
    }

    requestTransmit(link: StructureLink): void {
        this.transmit.push(link);
    }
};