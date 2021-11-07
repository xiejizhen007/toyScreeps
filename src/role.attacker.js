var roleAttacker = {
    /**
     * 
     * @param {Creep} creep 
     */
    run: function(creep) {
        if (!creep || creep.spawning) {
            return;
        }

        
    },

    /**
     * 
     * @param {Creep} creep 
     */
    prepare: function(creep) {
        if (!creep || creep.spawning) {
            return false;
        }

        let flag = Game.flags[creep.memory.mission.flagName];
        if (!flag.pos.inRangeTo(creep.pos, 2)) {
            creep.moveTo(flag);
        }
        else {
            return true;
        }

        return false;
    }
};

module.exports = roleAttacker;