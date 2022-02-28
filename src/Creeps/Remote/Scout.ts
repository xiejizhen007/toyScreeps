import { Role } from "Creeps/Role";

/*
* 侦察兵，查看房间附近的情况
*/
export class Scout extends Role {
    controller: StructureController;

    init(): void {
        this.creep.notifyWhenAttacked(false);
        this.controller = this.creep.room.controller;
    }

    work(): void {
        
    }
}