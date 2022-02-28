import { Role } from "Creeps/Role";

export class Reserver extends Role {
    // get target(): StructureController {
    //     if (this.creep.memory.task && this.creep.memory.task._target.id) {
    //         return Game.getObjectById(this.creep.memory.task._target.id as Id<StructureController>);
    //     }

    //     return null;
    // }

    // set target(controller: StructureController) {
    //     if (controller) {
    //         // this.creep.memory.task._target.id = controller.id;
    //     }
    // }

    init(): void {
        
    }

    work(): void {
        // this.creep.memory.task._target.id;

    }
}