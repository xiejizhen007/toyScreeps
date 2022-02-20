import { Priority } from "setting";
import { RoomNetwork } from "./RoomNetwork";

export class MineSite {
    roomNetwork: RoomNetwork;
    mineral: Mineral;
    extractor: StructureExtractor;
    container: StructureContainer;

    constructor(roomNetwork: RoomNetwork, mineral: Mineral, extractor: StructureExtractor) {
        this.roomNetwork = roomNetwork;
        this.mineral = mineral;
        this.extractor = extractor;
        this.container = mineral.pos.findInRange(roomNetwork.containers, 1)[0];
    }

    init(): void {
        this.registerOutputRequest();
    }

    work(): void {

    }

    private registerOutputRequest(): boolean {
        if (this.container && this.container.store.getUsedCapacity() > 1000) {
            this.roomNetwork.transportNetworkForTransfer.requestOutput(this.container, Priority.High, {
                resourceType: this.mineral.mineralType
            });
            console.log('mine site need transport resource');
            return true;
        }

        return false;
    }
}