export class LinkNetwork {
    room: Room;
    
    receiveLinks: StructureLink[];
    sendLinks: StructureLink[];

    constructor(room: Room) {
        this.room = room;

        this.receiveLinks = [];
        this.sendLinks = [];
    }

    init(): void {

    }

    work(): void {

    }

    registerReceive(link: StructureLink): void {
        this.receiveLinks.push(link);
    }

    registerSend(link: StructureLink): void {
        this.sendLinks.push(link);
    }
}