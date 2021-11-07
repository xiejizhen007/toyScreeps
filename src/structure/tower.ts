export const Tower = {
    
    run: function() {
        for (let spawnName in Game.spawns) {
            let tower = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER;
                }
            }) as any;

            for (let i = 0; i < tower.length; i++) {
                var target = tower[i].pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                if (target) {
                    tower[i].attack(target);
                    continue;
                }
            }
        }
    }
};