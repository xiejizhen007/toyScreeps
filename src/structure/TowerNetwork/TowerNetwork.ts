export class TowerNetwork {
    room: Room;                     // room
    towers: StructureTower[];       // all the towers
    repairTower: StructureTower[];  // the towers will be used for repairing.
    damagedStructure: Structure[];  // need to repair

    constructor(room: Room) {
        this.room = room;
        this.towers = [];
        this.repairTower = [];
    }

    refrash(): void {
        this.towers = [];
        this.repairTower = [];
    }

    repairStructure(): void {
        const towerLength = this.repairTower.length;
        for (const tower of this.repairTower) {
            // const s = _.find(this.damagedStructure, )    
            const s = tower.pos.findClosestByRange(this.damagedStructure, {
                filter: (d: Structure) => d.hits + 400 * towerLength < d.hitsMax
            });

            if (s) {
                tower.repair(s);
            }
        }
    }

    healCreep(creep: Creep): void {
        // this.room.creeps
    }
}