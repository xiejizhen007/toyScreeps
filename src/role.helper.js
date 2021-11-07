var roleHelper = {
    /**
     * 入口函数，让他去干活
     * @param {Creep} creep 
     */
    run: function(creep) {
        if (creep.memory.state == undefined) {
            creep.memory.state = 'init';
        }

        switch(creep.memory.state) {
            case 'init':
                this.init(creep);
                break;
            case 'work':
                this.work(creep);
                break;
            case 'getResource':
                this.getResource(creep);
                break;
        }
        
        this.newCreep(creep);
    },
    /**
     * 初始化，先去到点，看看有没有需要修的
     * @param {Creep} creep 
     */
    init: function(creep) {
        if (!creep || creep.spawning) { return; }
        if (creep.memory.state == undefined) {
            console.log('helper state changer to init');
            creep.memory.state = 'init';
        }

        if (creep.room.name != creep.memory.mission.workRoomName) {
            // creep.moveTo(new RoomPosition(25, 25, creep.memory.mission.workRoomName));
            let dirs = creep.memory.dirs;
            if (!dirs || dirs.length == 0) {
                dirs = creep.pos.findPathTo(new RoomPosition(25, 25, creep.memory.mission.workRoomName));
                if (dirs.length > 0) {
                    creep.memory.dirs = dirs;
                }
            }

            if (dirs.length > 0) {
                const terrain = new Room.Terrain(creep.room.name);
                if (terrain.get(dirs[0].x, dirs[0].y) == TERRAIN_MASK_WALL) {
                    creep.memory.dirs = undefined;
                    return;
                }
                if (creep.fatigue == 0) {
                    creep.move(dirs[0].direction);
                    // console.log('helper move dir: ' + dirs[0].direction);
                    creep.memory.dirs.shift();
                }
            }
            return;
        }

        let target = Game.getObjectById(creep.memory.mission.constructionID);
        if (!target) {
            target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if (target) {
                creep.memory.mission.constructionID = target.id;
            }
        }

        creep.memory.state = 'work';
    },

    /**
     * 干活
     * @param {Creep} creep 
     */
    work: function(creep) {
        if (creep.store.getUsedCapacity() == 0) {
            creep.memory.state = 'getResource';
            console.log('helper state changer to getResource');
            return;
        }

        let target = Game.getObjectById(creep.memory.mission.constructionID);
        if (!target) {
            target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if (target) {
                creep.memory.mission.constructionID = target.id;
            }
        }
        if (target) {
            if (!creep.pos.inRangeTo(target.pos, 3)) {
                creep.moveTo(target);
                return;
            }

            let tmp = creep.build(target);
            if (tmp != OK) {
                console.log('roleHelper build failed: ' + tmp);
            }
            return;
        }

        // creep.memory.isNeeded = false;
        let controller = creep.room.controller;
        if (controller && controller.my) {
            if (!creep.pos.inRangeTo(controller.pos, 3)) {
                creep.moveTo(controller);
                return;
            }

            let tmp = creep.upgradeController(controller);
            if (tmp != OK) {
                console.log('helper upgrader failer: ' + tmp);
            }
            return;
        }
    },

    /**
     * 挖能量
     * @param {Creep} creep 
     */
    getResource: function(creep) {
        if (creep.store.getFreeCapacity() == 0) {
            console.log('helper state changer to work');
            creep.memory.state = 'work';
            return;
        }

        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && 
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity(RESOURCE_ENERGY);
            }
        });
        if (container) {
            if (!creep.pos.inRangeTo(container.pos, 1)) {
                creep.moveTo(container);
                return;
            }

            let tmp = creep.withdraw(container, RESOURCE_ENERGY);
            if (tmp != OK) {
                console.log('roleHelper withdraw failed: ' + tmp);
            }
        }

        let source = Game.getObjectById(creep.memory.mission.sourceID);
        if (!source || source.energy == 0) {
            source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (source) {
                creep.memory.mission.sourceID = source;
            }
        }

        if (source) {
            if (!creep.pos.inRangeTo(source.pos, 1)) {
                creep.moveTo(source);
                return;
            }

            let tmp = creep.harvest(source);
            if (tmp != OK) {
                console.log('roleHelper harvest failed: ' + tmp);
            }
        }
    },

    /**
     * 
     * @param {Creep} creep 
     */
    newCreep: function(creep) {
        let target = Game.getObjectById(creep.memory.mission.constructionID);
        if (target) {
            if (creep.ticksToLive < 300 && creep.memory.isNeeded) {
                if (!Game.rooms[creep.memory.room]) {
                    return;
                }
                Game.rooms[creep.memory.room].memory.missions.push({
                    role: creep.memory.role, room: creep.memory.room, isNeeded: true, 
                    mission: creep.memory.mission
                });
                creep.memory.isNeeded = false;
                console.log('new mission by ' + creep.name);
            }
        }
    }
};

module.exports = {
    roleHelper
};