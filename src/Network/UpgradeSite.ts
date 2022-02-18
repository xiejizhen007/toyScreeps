import { RoomNetwork } from "./RoomNetwork";

export class UpgradeSite {
    roomNetwork: RoomNetwork;
    controller: StructureController;

    link: StructureLink | undefined;
    container: StructureContainer | undefined;

    constructor(roomNetwork: RoomNetwork, controller: StructureController) {
        this.roomNetwork = roomNetwork;
        this.controller = controller;

        // 7 级才有四个 link
        if (this.roomNetwork.room.controller.level >= 7) {
            this.link = this.controller.pos.findClosestByLimitedRange(this.roomNetwork.links, 3);
        }
    }

    init(): void {

    }

    work(): void {
        this.registerLinkRequest();
    }

    private registerLinkRequest(): boolean {
        if (this.link) {
            if (this.link.store[RESOURCE_ENERGY] <= 300) {
                this.roomNetwork.linkNetwork.registerReceive(this.link);
                // console.log('upgrade site register link');
            }
            
            return true;
        }

        return false;
    }
}