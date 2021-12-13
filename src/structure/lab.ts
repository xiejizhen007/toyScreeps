import { BOOST_STATE, labTarget, LAB_STATE, reactionResource, ROOM_TRANSFER_TASK } from "setting";
import { getBodyArray, getObject } from "utils";

export default class LabExtension extends StructureLab {
    public work(): void {
        this.init();

        // if (this.room.memory.boost.count > 0) {
        this.boostController();
        //     return;
        // }

        this.runLab();
    }

    private init(): void {
        if (!this.room.memory.lab) {
            this.room.memory.lab = {};
        }

        if (!this.room.memory.boost) {
            this.room.memory.boost = {};
        }

        if (!this.room.memory.boost.count || this.room.memory.boost.count < 0) {
            this.room.memory.boost.count = 0;
        }

        if (!this.room.memory.boost.resourceType) {
            this.room.memory.boost.resourceType = new Array();
        }
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

    /**
     * 每次固定拿 4 个 lab 来 boost，即使用不着 4 个
     * @returns boost 控制器
     */
    private boostController() {
        const flag = Game.flags[this.room.name + "Boost"];
        if (!flag) {
            return;
        }

        switch (this.room.memory.boost.state) {
            case BOOST_STATE.BOOST_GET_ENERGY:
                this.boostGetEnergy();
                break;
            case BOOST_STATE.BOOST_GET_RESOURCE:
                this.boostGetResource();
                break;
            case BOOST_STATE.BOOST_CLEAR:
                this.boostClear();
                break;
            default:
                this.room.memory.boost.state = BOOST_STATE.BOOST_GET_ENERGY;
                break;
        }
    }

    private boostGetEnergy() {
        if (this.room.hasTransferTask(ROOM_TRANSFER_TASK.BOOST_GET_ENERGY)) {
            return;
        }

        const flag = Game.flags[this.room.name + "Boost"];

        let lab1 = Game.getObjectById(this.room.memory.lab.lab1ID as Id<StructureLab>);
        let lab2 = Game.getObjectById(this.room.memory.lab.lab2ID as Id<StructureLab>);

        let labs = new Array();
        this.room.memory.lab.labsID.forEach(s => {
            let lab = Game.getObjectById(s as Id<StructureLab>);
            if (lab.pos.inRangeTo(flag, 1) && !lab.pos.isEqualTo(lab1) && !lab.pos.isEqualTo(lab2)
                && lab.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                labs.push(lab.id);
            }
        });

        let resource = new Array();
        
        // 能量装满了，开始拿化合物
        if (labs.length == 0) {
            this.room.memory.boost.state = BOOST_STATE.BOOST_GET_RESOURCE;
            return; 
        }

        labs.forEach(s => {
            resource.push({
                id: s,
                type: RESOURCE_ENERGY
            });
        });

        // 清理出 4 个 lab 来
        delete this.room.memory.lab.labsID;
        this.room.memory.lab.labsID = new Array();
        
        let tmps = this.room.find(FIND_STRUCTURES, {
            filter: s => {
                return s.structureType == STRUCTURE_LAB
                    && !s.pos.isEqualTo(lab1.pos)
                    && !s.pos.isEqualTo(lab2.pos)
                    && !labs.includes(s.id)
            }
        });

        tmps.forEach(f => {
            this.room.memory.lab.labsID.push(f.id)
        });

        this.room.memory.boost.labsID = labs;

        this.room.addTransferTask({
            type: ROOM_TRANSFER_TASK.BOOST_GET_ENERGY,
            resource: resource
        });
    }

    /**
     * TODO: 清理没用的化合物
     * @returns 
     */
    private boostGetResource() {
        if (this.room.hasTransferTask(ROOM_TRANSFER_TASK.BOOST_GET_RESOURCE)) {
            return;
        }

        const flag = Game.flags[this.room.name + "Boost"];

        let lab1 = Game.getObjectById(this.room.memory.lab.lab1ID as Id<StructureLab>);
        let lab2 = Game.getObjectById(this.room.memory.lab.lab2ID as Id<StructureLab>);

        // boost 旗子旁边可以用的 lab
        let labs = new Array();
        let labObjs = this.room.find(FIND_STRUCTURES, {
            filter: s => {
                return s.structureType == STRUCTURE_LAB
                    && !s.pos.isEqualTo(lab1)
                    && !s.pos.isEqualTo(lab2)
                    && s.pos.inRangeTo(flag, 1)
            }
        });

        labObjs.forEach(f => {
            labs.push(f.id)
        });

        this.room.memory.boost.labsID = labs;
        
        let count = labs.length;
        // console.log('boostGetResource: ' + count);

        let task = new Array();
        let again = true;

        // 最多 boost 4 个
        this.room.memory.boost.resourceType.forEach(f => {
            if (count == 0) {
                return; 
            }

            let lab = Game.getObjectById(labs[--count] as Id<StructureLab>);
            if (lab && lab.store[f] >= 1000) {
                again = false;
            }

            task.push({
                id: labs[count],
                type: f
            });
        });

        if (!again) {
            this.room.memory.boost.state = BOOST_STATE.BOOST_CLEAR;
            return;
        }

        this.room.addTransferTask({
            type: ROOM_TRANSFER_TASK.BOOST_GET_RESOURCE,
            resource: task
        });
    }

    private boostClear() {
        if (this.room.hasTransferTask(ROOM_TRANSFER_TASK.BOOST_CLEAR) || this.room.memory.boost.count == 0) {
            return;
        } else if (this.room.memory.boost.count > 0) {
            this.room.memory.boost.state = BOOST_STATE.BOOST_GET_ENERGY;
            return;
        }

        let resources = new Array();
        this.room.memory.boost.labsID.forEach(f => {
            let lab = Game.getObjectById(f as Id<StructureLab>);
            if (lab.mineralType) {
                resources.push({
                    id: lab.id,
                    type: lab.mineralType
                });
            }
        });

        delete this.room.memory.boost.labsID;
        delete this.room.memory.boost.resourceType;
        this.room.addTransferTask({
            type: ROOM_TRANSFER_TASK.BOOST_CLEAR,
            resource: resources
        });
    }
}