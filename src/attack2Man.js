const roleAttacker = require('./role.attacker');
const roleHealer = require('./role.healer');

var attack2Man = {
    /**
     * 
     * @param {Creep} docter 
     * @param {Creep} soldier 
     * @param {string} dir
     */
    move: function(docter, soldier, dir) {
        if (!docter || !soldier) {
            return false;
        }

        let ddir;
        let sdir;

        if (docter.fatigue != 0 || soldier.fatigue != 0) {
            return false;
        }

        ddir = docter.pos.getDirectionTo(soldier.pos);
        soldier.move(dir);
        docter.move(ddir);
        return true;
    },

    init: function() {
        if (!Memory.attack2Man) {
            Memory.attack2Man = {};
        }
        
        let soldier = Game.getObjectById(Memory.attack2Man.soldierID);
        let docter = Game.getObjectById(Memory.attack2Man.docterID);

        if (!soldier) {
            for (let creepName in Game.creeps) {
                let creep = Game.creeps[creepName];
                if (creep.memory.role == 'soldier') {
                    soldier = creep;
                    Memory.attack2Man.soldierID = creep.id;
                }
            }
        }

        if (!docter) {
            for (let creepName in Game.creeps) {
                let creep = Game.creeps[creepName];
                if (creep.memory.role == 'docter') {
                    soldier = creep;
                    Memory.attack2Man.docterID = creep.id;
                }
            }
        }

        if (!soldier && docter) {
            Game.rooms['W15N59'].memory.missions.push({role: 'soldier'});
            Game.rooms['W15N59'].memory.missions.push({role: 'docter'});
            docter.suicide();
            return;
        }

        if (!soldier || !docter) {
            return;
        }

        let flagGroup = Game.flags['W15N59Group'];
        if (soldier.spawning || docter.spawning) {
            // let flag = Game.flags['attack2ManGroup'].setPosition(flagGroup.pos);
            soldier.room.createFlag(flagGroup.pos, 'attack2ManGroup');
            Memory.attack2Man.ticks = 0;
        }

        if (!Memory.attack2Man.ticks) {
            Memory.attack2Man.ticks = 0;
        }
    },

    war: function() {
        let soldier = Game.getObjectById(Memory.attack2Man.soldierID);
        let docter = Game.getObjectById(Memory.attack2Man.docterID);

        if (!soldier || !docter) {
            return;
        }

        if (soldier.hits < docter.hits) {
            docter.heal(soldier);
        }
        else {
            docter.heal(docter);
        }

        let flag = Game.flags['attack2ManGroup'];
        if (flag) {
            soldier.moveTo(flag);
            docter.moveTo(flag);

            if (soldier.pos.inRangeTo(flag.pos, 1) && docter.pos.inRangeTo(flag.pos, 1)) {
                flag.remove();
            }
            return;
        }


        flag = Game.flags['attack2Man'];
        if (flag) {
            if (flag.pos.inRangeTo(soldier.pos, 3)) {
                if (soldier.memory.paths.length > 0) {
                    for (let i = 0; i < soldier.memory.paths.length; i++) {
                        soldier.memory.paths.shift();
                    }
                }

                if (!soldier.pos.inRangeTo(docter.pos, 1)) {
                    docter.moveTo(soldier);
                }

                let targets = soldier.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (targets && targets.pos.inRangeTo(soldier.pos, 3)) {
                    let tmp = soldier.attack(targets);
                    if (tmp == ERR_NOT_IN_RANGE) {
                        soldier.moveTo(targets);
                    }
                    return;
                }

                // targets = flag.pos.findInRange(FIND_HOSTILE_SPAWNS, 3);
                // if (targets && targets.length > 0) {
                //     let tmp = soldier.attack(targets[0]);
                //     if (tmp == ERR_NOT_IN_RANGE) {
                //         soldier.moveTo(targets[0]);
                //     }
                //     return;
                // }

                targets = soldier.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType != STRUCTURE_ROAD;
                            // structure.structureType != STRUCTURE_RAMPART;
                    }
                });
                if (targets) {
                    if (soldier.getActiveBodyparts(WORK) > 0) {
                        if (soldier.dismantle(targets) == ERR_NOT_IN_RANGE) {
                            soldier.moveTo(targets);
                        }
                    }
                    else if (soldier.getActiveBodyparts(ATTACK) > 0) {
                        if (soldier.attack(targets) == ERR_NOT_IN_RANGE) {
                            soldier.moveTo(targets);
                        }
                    }
                }

                targets = soldier.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES);
                if (targets) {
                    let tmp = soldier.attack(targets);
                    if (tmp == ERR_NOT_IN_RANGE) {
                        soldier.moveTo(targets);
                    }
                    return;
                }
            }
            else {
                if (!soldier.memory.flagPos) {
                    soldier.memory.flagPos = flag.pos;
                }

                if (!flag.pos.isEqualTo(new RoomPosition(soldier.memory.flagPos.x, soldier.memory.flagPos.y, soldier.memory.flagPos.roomName))) {
                    soldier.memory.paths = soldier.pos.findPathTo(flag.pos);
                    // console.log('soldier: find path');
                }

                if (soldier.memory.paths && soldier.memory.paths.length > 0) {
                    if (this.move(docter, soldier, soldier.memory.paths[0].direction)) {
                        soldier.memory.paths.shift();
                    }
                } else {
                    soldier.memory.paths = soldier.pos.findPathTo(flag.pos);
                    console.log('soldier: find path');
                }
            }
        }
    },

    loop: function() {
        this.init();
        this.war();
    }
}

module.exports = attack2Man;