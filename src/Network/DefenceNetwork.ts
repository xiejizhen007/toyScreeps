import { RoomNetwork } from "./RoomNetwork";

export class DefenceNetwork {
    roomNetwork: RoomNetwork;

    towers: StructureTower[];

    enemys: AnyCreep[];

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.towers = _.filter(this.roomNetwork.room.structures, f => f.structureType == STRUCTURE_TOWER) as StructureTower[];

        this.enemys = [];
    }

    // TODO: check enemy
    init(): void {
        this.enemys = _.filter(this.roomNetwork.room.creeps, f => !f.my);

        // console.log('enemys: ' + this.enemys.length);
    }

    // TODO: defence room and call soldier
    work(): void {
        for (const tower of this.towers) {
            if (tower.store[RESOURCE_ENERGY] > 0) {
                tower.attack(tower.pos.findClosestByRange(this.enemys));
            }
        }
    }
}