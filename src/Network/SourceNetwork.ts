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
        const memory = this.roomNetwork.memory.networks.sources[this.source.id];
        if (memory) {
            if (this.source.energy == this.source.energyCapacity) {
                memory.timeout++;
            } else {
                memory.timeout = 0;
            }

            // 检查 memory.creeps，去除死去得 creep
            let target = _.find(memory.creeps, f => Game.creeps[f] == undefined);
            while (target) {
                console.log('sourceNetwork remove creep\'s name: ' + target);
                _.remove(memory.creeps, f => f == target);
                target = _.find(memory.creeps, f => Game.creeps[f] == undefined);
            }

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
        this.spawnRoleToWork();
    }

    spawnRoleToWork(): void {
        
    }
}