import { Priority } from "setting";
import { RoomNetwork } from "./RoomNetwork";

/**
 * 房间的防御系统
 * 1. 由 tower 攻击敌人
 * 2. 由 tower 维护建筑血线（暂时）
 * 3. TODO: 添加主动防御
 */
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

        _.forEach(this.towers, t => {
            if (t.store[RESOURCE_ENERGY] <= 600) {
                // this.roomNetwork.logisticsNetwork.registerTask({
                //     source: 'any',
                //     target: t.id,
                //     priority: Priority.Normal,
                //     resourceType: RESOURCE_ENERGY,
                //     amount: t.store.getFreeCapacity(),
                // });
            }
        });
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

    // 暂时由塔维护建筑血量
    private repairStructure(): boolean {
        // const target = this.roomNetwork.containers.find(f => f.hits + 5000 < f.hitsMax);
        const target = this.roomNetwork.room.structures.find(f => f.hits < f.hitsMax / 2 
            && f.structureType != STRUCTURE_WALL && f.structureType != STRUCTURE_RAMPART);
        if (target) {
            // if (this.towers[0]) {
            //     this.towers[0].repair(target);
            // }
            const tower = _.find(this.towers, t => t.store[RESOURCE_ENERGY] > 500);
            if (tower) {
                tower.repair(target);
            }
            return true;
        }

        return false;
    }
}