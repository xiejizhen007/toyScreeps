import { LAB_STATE } from "setting";
import { getObject } from "utils";

export default class RoomController extends Room {
    /**
     * 定时检查 lab 集群状态，避免 lab 被摧毁后报错 
     */
    public labCheck(): void {
        if (!(this.controller && this.controller.my && this.controller.level >= 6)) { return; }
        if (!this.memory.lab) { this.memory.lab = {}; }

        let flag1 = Game.flags[this.name + 'Lab1'];
        let flag2 = Game.flags[this.name + 'Lab2'];

        if (!flag1 || !flag2) {
            return;
        }

        let lab1 = getObject(this.memory.lab.lab1ID) as StructureLab;
        let lab2 = getObject(this.memory.lab.lab2ID) as StructureLab;

        if (!lab1 || !flag1.pos.isEqualTo(lab1)) {
            lab1 = flag1.pos.lookFor(LOOK_STRUCTURES).find(f => f.structureType == STRUCTURE_LAB) as StructureLab;
            if (lab1) {
                this.memory.lab.lab1ID = lab1.id;
            }
        }

        if (!lab2 || !flag1.pos.isEqualTo(lab2)) {
            lab2 = flag2.pos.lookFor(LOOK_STRUCTURES).find(f => f.structureType == STRUCTURE_LAB) as StructureLab;
            if (lab2) {
                this.memory.lab.lab2ID = lab2.id;
            }
        }

        let labs = this.find(FIND_STRUCTURES, {
            filter: (s) => {
                s.structureType == STRUCTURE_LAB
                && !s.pos.isEqualTo(flag1)
                && !s.pos.isEqualTo(flag2)
            }
        });

        if (labs.length > 0) {
            this.memory.lab.labsID = [];
            labs.forEach(l => {
                this.memory.lab.labsID.push(l.id);
            });

            this.memory.lab.state = LAB_STATE.WORKING;
        }
    }
}