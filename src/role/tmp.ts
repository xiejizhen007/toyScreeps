import { Movement } from "./Movement";

export class RoleTmp {
    constructor(creep: Creep) {
        this.creep_ = creep;
    }

    public work() {
        if (this.creep_.spawning) { return; }
        // let terminal = this.creep_.room.terminal;
        // let storage = this.creep_.room.storage;
        // if (!terminal || !storage) { return; }
        
        // if (this.creep_.memory.work) {
        //     // if (this.creep_.transferTo(storage, ))
        //     for (let type in this.creep_.store) {
        //         let resourceType = type as ResourceConstant;
        //         if (this.creep_.transferTo(storage, resourceType) == OK) {
        //             this.creep_.memory.work = false;
        //             return;
        //         }
        //     }
        // }
        // else {
        //     for (let type in terminal.store) {
        //         let resourceType = type as ResourceConstant;
        //         if (this.creep_.withdrawFrom(terminal, resourceType) == OK) {
        //             this.creep_.memory.work = true;
        //             return;
        //         }
        //     }
        // }

        const flag = Game.flags[this.creep_.memory.task.flagName];
        if (flag) {
            Movement.goTo(this.creep_, flag.pos);
        }
    }

    private creep_: Creep;
}