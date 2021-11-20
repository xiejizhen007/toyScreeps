import { CREEP_STATE } from 'setting'

export class RoleHarvester {
    constructor(creep: Creep) {
        this.creep_ = creep;
    }

    public work() {
        this.check();

        switch(this.creep_.memory.state) {
            case CREEP_STATE.PREPARE:
                this.prepare();
                break;
            case CREEP_STATE.TARGET:
                this.target();
                break;
            default:
                this.creep_.memory.state = CREEP_STATE.PREPARE;
                break;
        }
    }

    private prepare() {
        if (!this.creep_ || this.creep_.spawning) { return; }

        let sourceFlag = Game.flags[this.creep_.memory.task.flagName];
        if (!sourceFlag) {
            console.log('create flag for ' + this.creep_.id);
            return;
        }

        if (!sourceFlag.pos.isEqualTo(this.creep_.pos)) {
            this.creep_.goTo(sourceFlag.pos);
            return;
        }

        this.creep_.memory.state = CREEP_STATE.TARGET;
    }

    private target() {
        let source = Game.getObjectById<Source>(this.creep_.memory.task.sourceID);
        let container = Game.getObjectById<StructureContainer>(
            this.creep_.memory.task.containerID);
        let constructionSite = Game.getObjectById<ConstructionSite>(
            this.creep_.memory.task.constructionSiteID);

        if (!source) {
            source = this.creep_.pos.findClosestByRange(FIND_SOURCES);
            this.creep_.memory.task.sourceID = source.id;
        }

        if (!source) {
            console.log('there is not source around ' + this.creep_.pos);
            // this.creep_.suicide();
            return;
        }

        this.creep_.getEnergyFrom(source);

        if (constructionSite) {
            this.creep_.build(constructionSite);
        }
        else if (container && container.hits != container.hitsMax) {
            this.creep_.repair(container);
        }
        else if (!constructionSite && !container) {
            container = this.creep_.pos.lookFor(LOOK_STRUCTURES).find(
                f => f.structureType == STRUCTURE_CONTAINER) as StructureContainer;
            constructionSite = this.creep_.pos.lookFor(LOOK_CONSTRUCTION_SITES).find(
                f => f.structureType == STRUCTURE_CONTAINER);
            
            if (container) { this.creep_.memory.task.containerID = container.id; }
            else if (constructionSite) { 
                this.creep_.memory.task.constructionSiteID = constructionSite.id; 
            }
            else {
                this.creep_.room.createConstructionSite(this.creep_.pos, 
                    STRUCTURE_CONTAINER);
            }
        }
    }
    
    private check() {
        if (this.creep_.ticksToLive <= 10 && this.creep_.memory.isNeeded) {
            let spawnRoom = Game.rooms[this.creep_.memory.room];
            if (!spawnRoom) { return; }

            spawnRoom.addSpawnTask(this.creep_);
            console.log('add spawn task: ' + this.creep_.name);
        }
    }

    private creep_: Creep;
}

export class RoleBuilder {
    constructor(creep: Creep) {
        this.creep_ = creep;
    }

    public work() {
        this.check();

        switch (this.creep_.memory.state) {
            case CREEP_STATE.PREPARE:
                this.prepare();
                break;
            case CREEP_STATE.TARGET:
                this.target();
                break;
            case CREEP_STATE.BACK:
                this.getResource();
                break;
            default:
                this.creep_.memory.state = CREEP_STATE.PREPARE;
                break;
        }   
    }

    private prepare() {
        if (this.creep_.spawning) { return; }

        if (this.creep_.room.name != this.creep_.memory.task.workRoomName) {
            this.creep_.farGoTo(new RoomPosition(25, 25, this.creep_.memory.task.workRoomName));
            return;
        }

        this.creep_.memory.state = CREEP_STATE.TARGET;
    }

    private target() {
        if (this.creep_.store[RESOURCE_ENERGY] == 0) {
            this.creep_.memory.state = CREEP_STATE.BACK;
            return;
        }
        
        let constructionSite = Game.getObjectById<ConstructionSite>(this.creep_.memory.task.constructionSiteID);
        if (!constructionSite) {
            const constructionSites = this.creep_.room.find(FIND_CONSTRUCTION_SITES);
            constructionSite = this.creep_.pos.findClosestByRange(constructionSites);
            if (!constructionSite) { 
                this.creep_.suicide();
                return;
            }
            else 
                this.creep_.memory.task.constructionSiteID = constructionSite.id;
        }

        if (this.creep_.pos.inRangeTo(constructionSite, 3)) {
            this.creep_.build(constructionSite);    
        } else {
            this.creep_.goTo(constructionSite.pos);
        }

    }

    private getResource() {
        if (this.creep_.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            this.creep_.memory.state = CREEP_STATE.TARGET;
            return;
        }

        const storage = this.creep_.room.storage;
        const terminal = this.creep_.room.terminal;

        if (storage) { this.creep_.getEnergyFrom(storage); return; }
        else if (terminal) { this.creep_.getEnergyFrom(terminal); return; }

        let resource = Game.getObjectById<Resource>(this.creep_.memory.resourceID);
        if (!resource) {
            const resources = this.creep_.room.find(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY
            });
            resource = this.creep_.pos.findClosestByRange(resources);
            if (resource) { this.creep_.memory.resourceID = resource.id; }
        }

        if (resource) { 
            this.creep_.pickupFrom(resource); 
            return;
        }

        let tombstone = Game.getObjectById<Tombstone>(this.creep_.memory.tombstoneID);
        if (!tombstone) {
            const tombstones = this.creep_.room.find(FIND_TOMBSTONES, {
                filter: t => t.store[RESOURCE_ENERGY] > 0
            });
            tombstone = this.creep_.pos.findClosestByRange(tombstones);
            if (tombstone) { this.creep_.memory.tombstoneID = tombstone.id; }
        }

        if (tombstone) { 
            const amount = Math.min(this.creep_.store.getFreeCapacity(), tombstone.store[RESOURCE_ENERGY]);
            this.creep_.withdrawFrom(tombstone, RESOURCE_ENERGY, amount); 
            return;
        }

        // let source = Game.getObjectById<Source>(this.creep_.memory.sourceID);
        // if (!source) {
        //     const sources = this.creep_.room.find(FIND_SOURCES_ACTIVE);
        //     source = this.creep_.pos.findClosestByRange(sources);
        //     this.creep_.memory.sourceID = source.id;
        // }

        // if (source) { 
        //     this.creep_.getEnergyFrom(source); 
        //     return; 
        // }
    }

    private check() {
        const target = Game.getObjectById<ConstructionSite>(this.creep_.memory.task.constructionSiteID);
        if (this.creep_.ticksToLive <= 10 && this.creep_.memory.isNeeded && target) {
            let spawnRoom = Game.rooms[this.creep_.memory.room];
            if (!spawnRoom) { return; }

            spawnRoom.addSpawnTask(this.creep_);
            console.log('add spawn task: ' + this.creep_.name);
        }
    }

    private creep_: Creep
}

export class RoleUpgrader {
    constructor(creep: Creep) {
        this.creep_ = creep;
    }

    public work() {

    }

    private prepare() {

    }

    private target() {

    }

    private check() {
        
    }

    private creep_: Creep;    
}