import { labTarget, LAB_STATE, reactionResource, ROOM_TRANSFER_TASK } from "setting";
import { getBodyArray, getObject } from "utils";

export default class LabExtension extends StructureLab {
    public work(): void {
        if (!this.room.memory.lab) { this.room.memory.lab = {}; }
        
        this.runLab();
    }

    private runLab(): void {
        switch (this.room.memory.lab.state) {
            case LAB_STATE.INIT:
                this.room.labCheck();
                break;
            case LAB_STATE.WORKING:
                this.labWorking();
                break;
            case LAB_STATE.GET_TARGET:
                this.labGetTarget();
                break;
            case LAB_STATE.IN_RESOURCE:
                this.labInResource();
                break;
            case LAB_STATE.OUT_RESOURCE:
                this.labOutResource();
                break;
            default:
                this.room.memory.lab.state = LAB_STATE.INIT;
                break;
        } 
    }

    private labGetTarget(): void {
        if (!this.room.memory.lab.targetIndex) {
            this.room.memory.lab.targetIndex = 0;
        }

        const terminal = this.room.terminal;
        if (!terminal) {
            console.log('terminal 不存在');
            return;
        }

        const resource = labTarget[this.room.memory.lab.targetIndex];
        if (!resource) { 
            this.setNextInedx();
            return; 
        }

        const enResource = reactionResource[resource.target];
        if (terminal.store[enResource[0]] <= 100 
        || terminal.store[enResource[1]] <= 100
        || terminal.store[resource.target] >= resource.number) {
            this.setNextInedx();
            return;
        }

        this.room.memory.lab.state = LAB_STATE.IN_RESOURCE;
    }

    private labInResource(): void {
        let lab1 = Game.getObjectById<StructureLab>(this.room.memory.lab.lab1ID);
        let lab2 = Game.getObjectById<StructureLab>(this.room.memory.lab.lab2ID);

        if (!lab1 || !lab2) {
            console.log('底物 lab 呢？');
            return;
        }

        if (lab1.mineralType && lab2.mineralType) {
            this.room.memory.lab.state = LAB_STATE.WORKING;
            return;
        }

        const terminal = this.room.terminal;
        if (!terminal) {
            console.log('labInResource: terminal 不存在' );
            return;
        }

        const resource = labTarget[this.room.memory.lab.targetIndex];
        const enResource = reactionResource[resource.target];
        if (terminal.store[enResource[0]] <= 100 || terminal.store[enResource[1]] <= 100) {
            this.room.memory.lab.state = LAB_STATE.GET_TARGET;
            this.setNextInedx();
            return;
        }

        this.room.addTransferTask({
            type: ROOM_TRANSFER_TASK.LAB_IN,
            resource: [
                {
                    id: lab1.id,
                    type: enResource[0],
                    amount: 500,
                },
                {
                    id: lab2.id,
                    type: enResource[1],
                    amount: 500
                }
            ]
        });
    }

    private labOutResource(): void {
        const terminal = this.room.terminal;
        if (!terminal) { return; }

        if (this.room.hasTransferTask(ROOM_TRANSFER_TASK.LAB_OUT)) { return; }

        let labsID = this.room.memory.lab.labsID;
        for (let i = 0; i < labsID.length; i++) {
            let lab = Game.getObjectById(labsID[i]) as StructureLab;
            if (lab && lab.store[lab.mineralType] > 0) {
                this.room.addTransferTask({
                    type: ROOM_TRANSFER_TASK.LAB_OUT,
                    labsID: labsID,
                });
                return;
            }
        }

        this.room.memory.lab.state = LAB_STATE.GET_TARGET;
        this.setNextInedx();
    }

    private labWorking(): void {
        let lab1 = Game.getObjectById(this.room.memory.lab.lab1ID) as StructureLab;
        let lab2 = Game.getObjectById(this.room.memory.lab.lab2ID) as StructureLab;
        let labsID = this.room.memory.lab.labsID;

        if (!lab1 || !lab2 || !labsID || !labsID.length) {
            this.room.memory.lab.state = LAB_STATE.INIT;
            console.log('error: not inLab!!!');
            return;
        }
        
        // 冷却中，直接退出
        if (this.room.memory.lab.cooldown != undefined && !this.room.memory.lab.cooldown) {
            this.room.memory.lab.cooldown--;
            return;
        }

        for (let i = 0; i < labsID.length; i++) {
            let lab = Game.getObjectById(labsID[i]) as StructureLab;
            if (!lab) {
                console.log(labsID[i] + ' is undefined');
                delete this.room.memory.lab.labsID;
                return;
            }

            const labResult = lab.runReaction(lab1, lab2);
            // 没冷却完全
            if (labResult == ERR_TIRED) {
                this.room.memory.lab.cooldown = lab.cooldown;
                return;
            }
            // 没底物了
            else if (labResult == ERR_NOT_ENOUGH_RESOURCES || labResult == ERR_INVALID_ARGS) {
                this.room.memory.lab.state = LAB_STATE.OUT_RESOURCE;
                return;
            }
            else if (labResult != OK) {
                console.log('lab return: ' + labResult);
                return;
            }
        }

    }

    private setNextInedx(): number {
        this.room.memory.lab.targetIndex = this.room.memory.lab.targetIndex + 1
            >= labTarget.length ? 0 : this.room.memory.lab.targetIndex + 1;
        
        return this.room.memory.lab.targetIndex;
    }

}