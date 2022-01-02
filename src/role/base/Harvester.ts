import { RoomNetwork } from "Network/RoomNetwork/RoomNetwork";
import { Role } from "role/role";

// TODO: 利用 Link 传送能量，目的地为中央集群或者控制器
export class Harvester {
    creep: Creep;
    roomNetwork: RoomNetwork;

    constructor(roomNetwork: RoomNetwork, name: string) {
        this.roomNetwork = roomNetwork;
        this.creep = Game.creeps[name];
    }

    work(): void {
        const flag = Game.flags[this.creep.memory.task.flagName];
        if (!flag) {
            console.log('flag for id: ' + this.creep.id);
            return;
        }

        const link = flag.pos.findInRange(this.roomNetwork.links, 1)[0];
        if (!link) {
            console.log('link no');
            return;
        }

        const flagCenter = Game.flags[this.creep.room.name + 'Center'];
        const linkCenter = flagCenter.pos.findClosestByRange(this.roomNetwork.links);
        // console.log(linkCenter + ' ' + linkCenter.store[RESOURCE_ENERGY]);

        const source = flag.pos.findClosestByRange(FIND_SOURCES);

        if (!this.creep.pos.isNearTo(source)) {
            this.creep.moveTo(source);
            return;
        }

        if (this.creep.store.getFreeCapacity() < 10) {
            this.creep.transfer(link, RESOURCE_ENERGY);
            // return;
        }

        console.log('link store: ' + link.store[RESOURCE_ENERGY]);

        if (link.store[RESOURCE_ENERGY] > 600) {
            console.log('need link');
            this.roomNetwork.linkNetwork.requestTransport(link);
            this.roomNetwork.linkNetwork.requestReceive(linkCenter);
        }

        if (this.creep.store.getFreeCapacity() >= 10) {
            // this.creep.transfer(link, RESOURCE_ENERGY);
            this.creep.harvest(source);        
            // return;
        }
    }


}