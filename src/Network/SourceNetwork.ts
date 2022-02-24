import { Priority } from "setting";
import { RoomNetwork } from "./RoomNetwork";

export class SourceNetwork {
    roomNetwork: RoomNetwork;
    source: Source;

    memory: SourceNetworkMemory;

    container: StructureContainer;
    link: StructureLink;

    constructor(roomNetwork: RoomNetwork, source: Source) {
        this.roomNetwork = roomNetwork;
        this.source = source;

        this.container = source.pos.findInRange(roomNetwork.containers, 1)[0];
        this.link = source.pos.findInRange(roomNetwork.links, 2)[0];
        this.memory = roomNetwork.memory.networks.sources[source.id];
    }

    init(): void {
        const memory = this.roomNetwork.memory.networks.sources[this.source.id];
        if (memory) {
            if (this.source.energy == this.source.energyCapacity || memory.creeps.length == 0) {
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
        this.registerLinkSend();
        this.registerOutputTask();
    }

    spawnRoleToWork(): void {
        
    }

    private registerLinkSend(): boolean {
        if (this.link && this.link.store[RESOURCE_ENERGY] >= 700) {
            this.roomNetwork.linkNetwork.registerSend(this.link);
            return true;
        } else {
            return false;
        }
    }

    private registerOutputTask(): boolean {
        if (this.container && this.container.store[RESOURCE_ENERGY] > 800) {
            this.roomNetwork.transportNetworkForTransfer.requestOutput(this.container, Priority.Normal, {
                resourceType: RESOURCE_ENERGY,
                amount: this.container.store[RESOURCE_ENERGY]
            });

            return true;
        }

        return false;
    }
}