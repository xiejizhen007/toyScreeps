import { RoomNetwork } from "./RoomNetwork";

export class SourceNetwork {
    roomNetwork: RoomNetwork;
    source: Source;

    container: StructureContainer;
    link: StructureLink;

    constructor(roomNetwork: RoomNetwork, source: Source) {
        this.roomNetwork = roomNetwork;
        this.source = source;
    }

    init(): void {
        if (this.roomNetwork.memory.networks.sources[this.source.id]) {
            let s = this.roomNetwork.memory.networks.sources[this.source.id];
            // this.source.energy
            if (this.source.energy == this.source.energyCapacity) {
                s.timeout++;
            } else {
                s.timeout = 0;
            }
            // console.log('source ' + this.source.id + ' timeout: ' + s.timeout);
        } else {
            this.roomNetwork.memory.networks.sources[this.source.id] = {
                sourceId: this.source.id,
                pos: this.source.pos,
                timeout: 0,
                creeps: [],
            }
        }
    }

    work(): void {

    }
}