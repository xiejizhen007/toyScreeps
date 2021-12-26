import { RoomNetwork } from "../RoomNetwork";
import { BaseNetwork } from "./BaseNetwork";

export class SourceNetwork extends BaseNetwork {
    source: Source;

    constructor(roomNetwork: RoomNetwork, source: Source) {
        super(roomNetwork, source, 'SourceNetwork');
        this.source = source;
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