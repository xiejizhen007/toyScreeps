import { addRoleSpawnTask, addSpawnTask, callReserver, removeReserverRoom } from "utils";
import { CREEP_STATE } from "setting";

export class harvesterRoom {
    constructor(creep: Creep) {
        this.creep_ = creep;
    }

    public work() {
        switch(this.creep_.memory.state) {
            case CREEP_STATE.PREPARE:
                this.prepare();
                break;
            case CREEP_STATE.TARGET:
                this.target();
                break;
            case CREEP_STATE.BACK:
                this.back();
                break;
            default:
                this.creep_.memory.state = CREEP_STATE.PREPARE;
                break;
        }
    }

    private prepare() {
        if (!this.creep_ && this.creep_.spawning) { return; }
    
        let sourceFlag = Game.flags[this.creep_.memory.task.flagName];
        if (!sourceFlag) {
            console.log('create flag for ' + this.creep_.id);
            return;
        }

        // 前往工作地点
        if (!sourceFlag.pos.isEqualTo(this.creep_.pos)) { 
            this.creep_.farGoTo(sourceFlag.pos); 
            return;
        }

        this.creep_.memory.state = CREEP_STATE.TARGET;
    }

    private target() {
        let source = Game.getObjectById<Source>(this.creep_.memory.task.sourceID);
        if (!source) {
            source = this.creep_.pos.findClosestByRange(FIND_SOURCES);
            this.creep_.memory.task.sourceID = source.id;
        }

        if (!source) {
            console.log('there is not source around ' + this.creep_.pos);
            // this.creep_.suicide();
            return;
        }

        // 派活
        if (this.creep_.room.controller && !this.creep_.room.controller.reservation) {

        }

        this.creep_.getEnergyFrom(source);
        if (this.creep_.store.getFreeCapacity() == 0) {
            this.creep_.memory.state = CREEP_STATE.BACK;
        }
    }

    private back() {
        let room = Game.rooms[this.creep_.memory.room];
        if (!room) {
            console.log('spawnRoom does not exist!!!');
            this.creep_.say('myRoom!!!');
            return;
        }

        let storage = room.storage;
        let terminal = room.terminal;
        
        if (!storage && !terminal) {
            console.log('spawnRoom\'s storage and terminal do not exist!!!');
            this.creep_.say('noTarget');
            return;
        }

        if (this.creep_.room.name != room.name) {
            this.creep_.farGoTo(new RoomPosition(room.controller.pos.x, room.controller.pos.y, room.name));
            return;   
        }

        let tmp: number;
        if (terminal) { tmp = this.creep_.transferTo(terminal, RESOURCE_ENERGY); }
        else if (storage) { tmp = this.creep_.transferTo(storage, RESOURCE_ENERGY); }

        if (tmp == OK) { this.creep_.memory.state = CREEP_STATE.PREPARE; }
    }

    private creep_: Creep;
}