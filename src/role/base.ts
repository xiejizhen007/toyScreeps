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

}

export class RoleUpgrader {
    
}