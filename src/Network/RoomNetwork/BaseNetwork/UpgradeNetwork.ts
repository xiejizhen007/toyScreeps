import { RoomNetwork } from "../RoomNetwork";
import { BaseNetwork } from "./BaseNetwork";

export class UpgradeNetwork extends BaseNetwork {
    controller: StructureController;
    link: StructureLink;
    container: StructureContainer;

    constructor(roomNetwork: RoomNetwork, controller: StructureController) {
        super(roomNetwork, controller, 'UpgradeNetwork');
        
        this.controller = controller;
        this.link = controller.pos.findClosestByRange(roomNetwork.links, {
            filter: (link: StructureLink) => link.pos.inRangeTo(controller, 3)
        });
    }

    refresh(): void {
        
    }

    spawnNetworkCreep(): void {
        
    }

    init(): void {
        
    }

    work(): void {
        
    }
}