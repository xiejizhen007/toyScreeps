import { RoomNetwork } from "./RoomNetwork";

export class DefenceNetwork {
    roomNetwork: RoomNetwork;

    towers: StructureTower[];

    enemies: Creep[];

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        // this.towers = _.filter(this.roomNetwork.room.structures, f => f.structureType == STRUCTURE_TOWER) as StructureTower[];
        this.towers = roomNetwork.towers;

        this.enemies = roomNetwork.room.enemies;
    }

    // TODO: check enemy
    init(): void {
        this.enemies = _.filter(this.roomNetwork.room.creeps, f => !f.my);

        // if (this.towers) {
        //     console.log('towers: ' + this.towers.length);
        // }
            
        // console.log('towers: ' + this.towers);
    }

    // TODO: defence room and call soldier
    work(): void {
        if (this.enemies.length > 0) {
            for (const tower of this.towers) {
                if (tower.store[RESOURCE_ENERGY] > 0) {
                    tower.attack(tower.pos.findClosestByRange(this.enemies));
                }
            }
        } else {
            this.repairStructure();
        }
    }

    private repairStructure(): boolean {
        const target = this.roomNetwork.containers.find(f => f.hits + 5000 < f.hitsMax);
        if (target) {
            if (this.towers[0]) {
                this.towers[0].repair(target);
            }
            return true;
        }

        return false;
    }
}