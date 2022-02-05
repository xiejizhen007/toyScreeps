import { RoomNetwork } from "../RoomNetwork";
import { BaseNetwork } from "./BaseNetwork";

export class UpgradeNetwork extends BaseNetwork {
    controller: StructureController;
    link: StructureLink;
    container: StructureContainer;

    constructor(roomNetwork: RoomNetwork, controller: StructureController) {
        super(roomNetwork, controller, 'UpgradeNetwork');
        
        this.controller = controller;
        this.container = _.find(roomNetwork.containers, f => {
            const noSource = _.filter(roomNetwork.containers, container => container.pos.findInRange(FIND_SOURCES, 1).length == 0);
            return controller.pos.findClosestByRange(noSource);
        });
        this.link = controller.pos.findClosestByRange(roomNetwork.links, {
            filter: (link: StructureLink) => link.pos.inRangeTo(controller, 3)
        });
    }

    refresh(): void {
        
    }

    spawnNetworkCreep(): void {
        
    }

    init(): void {
        if (this.link && this.link.store[RESOURCE_ENERGY] <= 400) {
            this.roomNetwork.linkNetwork.requestReceive(this.link);
        }
    }

    work(): void {
        
    }
}