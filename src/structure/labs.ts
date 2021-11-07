import { LAB_STATE, labTarget, LAB_TRANSFER_TASK, reactionResource, BOOST_STATE, BOOST_RESOURCE, ROOM_TRANSFER_TASK } from "setting";
import { hasTransferTask, addTransferTask } from "modules/utils";

export const Lab = {
    /**
     * lab 集群干活入口
     */
    run: function(room : Room) {
        if (room.memory.lab == undefined) { room.memory.lab = {}; }
        if (room.memory.boost) { room.memory.lab.state = LAB_STATE.BOOST; }
        
        switch(room.memory.lab.state) {
            case LAB_STATE.BOOST:
                boostControlleer(room);
                break;
            case LAB_STATE.IN_RESOURCE:
                this.inResource(room);
                break;
            case LAB_STATE.OUT_RESOURCE:
                this.outResource(room);
                break;
            case LAB_STATE.WORKING:
                this.working(room);
                break;
            case LAB_STATE.INIT:
                this.init(room);
                break;
            case LAB_STATE.GET_TARGET:
                this.getTarget(room);
                break;
            case undefined:
                room.memory.lab.state = LAB_STATE.INIT;
        }
    },

    init: function(room : Room) {
        let flag1 = Game.flags[room.name + 'Lab1'];
        let flag2 = Game.flags[room.name + 'Lab2'];

        if (!flag1 || !flag2) {
            return;
        }

        let lab1 = Game.getObjectById(room.memory.lab.lab1ID) as StructureLab;
        let lab2 = Game.getObjectById(room.memory.lab.lab2ID) as StructureLab;

        if (!lab1 || !flag1.pos.isEqualTo(lab1.pos)) {
            let labs = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LAB && 
                        structure.pos.isEqualTo(flag1.pos);
                }
            }) as any;

            if (labs.length > 0) {
                lab1 = labs[0];
                room.memory.lab.lab1ID = lab1.id;
            }
        }

        if (!lab2 || !flag2.pos.isEqualTo(lab2.pos)) {
            let labs = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LAB && 
                        structure.pos.isEqualTo(flag2.pos);
                }
            }) as any;

            if (labs.length > 0) {
                lab2 = labs[0];
                room.memory.lab.lab2ID = lab2.id;
            }
        }

        if (room.memory.lab.labsID == undefined || room.memory.lab.labsID.length >= 10) {
            room.memory.lab.labsID = [];
        }

        let labs = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LAB;
            }
        });
        for (let i = 0; i < labs.length; i++) {
            let lab = labs[i];
            if (lab.pos.isEqualTo(lab1.pos) || lab.pos.isEqualTo(lab2.pos)) {
                continue;
            }

            if (room.memory.lab.labsID.includes(lab.id) == false) {
                room.memory.lab.labsID.push(lab.id);
            }
        }

        if (lab1 && lab2) {
            room.memory.lab.state = LAB_STATE.WORKING;
            console.log(room.name + ' lab to work');
        }
    },

    working: function(room : Room) {
        let lab1 = Game.getObjectById(room.memory.lab.lab1ID) as StructureLab;
        let lab2 = Game.getObjectById(room.memory.lab.lab2ID) as StructureLab;
        let labsID = room.memory.lab.labsID;

        if (!lab1 || !lab2 || !labsID || !labsID.length) {
            room.memory.lab.state = LAB_STATE.INIT;
            console.log('error: not inLab!!!');
            return;
        }

        // 冷却中，直接退出
        if (room.memory.lab.cooldown != undefined && !room.memory.lab.cooldown) {
            room.memory.lab.cooldown--;
            return;
        }

        for (let i = 0; i < labsID.length; i++) {
            let lab = Game.getObjectById(labsID[i]) as StructureLab;
            if (!lab) {
                console.log(labsID[i] + ' is undefined');
                continue;
            }

            const labResult = lab.runReaction(lab1, lab2);
            // 没冷却完全
            if (labResult == ERR_TIRED) {
                room.memory.lab.cooldown = lab.cooldown;
                return;
            }
            // 没底物了
            else if (labResult == ERR_NOT_ENOUGH_RESOURCES || labResult == ERR_INVALID_ARGS) {
                room.memory.lab.state = LAB_STATE.OUT_RESOURCE;
                return;
            }
            else if (labResult != OK) {
                console.log('lab return: ' + labResult);
                return;
            }
        }
    },

    inResource: function(room : Room) {
        // 够底物反应了，进行反应
        let lab1 = Game.getObjectById(room.memory.lab.lab1ID) as StructureLab;
        let lab2 = Game.getObjectById(room.memory.lab.lab2ID) as StructureLab;

        if (lab1.mineralType && lab2.mineralType) {
            room.memory.lab.state = LAB_STATE.WORKING;
            return;
        }
        
        // 获取底物
        let terminal = room.terminal;
        if (!terminal) {
            console.log('terminal dost not exist');
            return;
        }

        // 有底物传输的任务了
        if (hasTransferTask(room, ROOM_TRANSFER_TASK.LAB_IN)) {
            return;
        }

        if (room.memory.lab.targetIndex == undefined) {
            room.memory.lab.targetIndex = 0;
        }

        const targetResource = labTarget[room.memory.lab.targetIndex].target
        const enResource = reactionResource[targetResource];
        if (terminal.store[enResource[0]] < 100 || terminal.store[enResource[1]] < 100) {
            room.memory.lab.state = LAB_STATE.GET_TARGET;
            this.setNextIndex(room);
        }
        else {
            addTransferTask(room, {
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
                        amount: 500,
                    }
                ]
            });
        }
    },

    outResource: function(room : Room) {
        let terminal = room.terminal;
        if (!terminal) {
            console.log('terminal dost not exist');
            return;
        }

        // 已经有任务了
        if (hasTransferTask(room, ROOM_TRANSFER_TASK.LAB_OUT)) {
            return;
        }

        let labsID = room.memory.lab.labsID;
        for (let i = 0; i < labsID.length; i++) {
            let lab = Game.getObjectById(labsID[i]) as StructureLab;
            if (lab && lab.store[lab.mineralType] > 0) {
                addTransferTask(room, {
                    type: ROOM_TRANSFER_TASK.LAB_OUT,
                });
                return;
            }
        }

        // 反应物全送走了之后，重新开始
        room.memory.lab.state = LAB_STATE.GET_TARGET;
        this.setNextIndex(room);
    },

    getTarget: function(room: Room) {
        if (!room.memory.lab.targetIndex) {
            room.memory.lab.targetIndex = 0;
        }        

        const resource = labTarget[room.memory.lab.targetIndex];
        if (!resource) {
            this.setNextIndex(room);
            return;
        }

        let terminal = room.terminal;
        if (!terminal) {
            return;
        }
        
        // 够了
        if (terminal.store[resource.target] >= resource.number) {
            this.setNextIndex(room);
            return;
        }

        room.memory.lab.state = LAB_STATE.IN_RESOURCE;
    },

    setNextIndex: function(room : Room) {
        room.memory.lab.targetIndex = room.memory.lab.targetIndex + 1 > labTarget.length ? 0 : room.memory.lab.targetIndex + 1;
        return room.memory.lab.targetIndex;
    },
};

/**
 * boost 主控器
 * @param room 需要 boost 的房间
 */
export const boostControlleer = function (room: Room) {
    if (!room.memory.boost) { room.memory.boost = {}; }

    switch (room.memory.boost.state) {
        case BOOST_STATE.BOOST_GET_RESOURCE:
            boostGetResource(room);
            break;
        case BOOST_STATE.BOOST_GET_ENERGY:
            boostGetEnergy(room);
            break;
        case BOOST_STATE.BOOST_WAIT:
            break;
        case BOOST_STATE.BOOST_CLEAR:
            boostClear(room);
            break;
        default:
            room.memory.boost.state = BOOST_STATE.BOOST_GET_RESOURCE;
            break;
    }
}

export const boostGetResource = function (room: Room) {
    const boostTask = room.memory.boost;

    let resourceReady = true;
    for (const i in BOOST_RESOURCE[boostTask.type]) {
        const lab = Game.getObjectById<StructureLab>(boostTask.labsID[i]);
        if (!lab) continue;

        if (lab.store[BOOST_RESOURCE[boostTask.type][i]] <= 0) resourceReady = false;
    }

    if (resourceReady) {
        console.log('boost resource is ok, ready to boost');
        room.memory.boost.state = BOOST_STATE.BOOST_GET_ENERGY;
    }
    else if (!hasTransferTask(room, ROOM_TRANSFER_TASK.BOOST_GET_RESOURCE)) {
        addTransferTask(room, {
            type: ROOM_TRANSFER_TASK.BOOST_GET_RESOURCE,

        });
    }
}

export const boostGetEnergy = function (room: Room) {
    const boostTask = room.memory.boost;
    // lab 中有底物
    for (const i in boostTask.labsID) {
        const lab = Game.getObjectById<StructureLab>(boostTask.labsID[i]);

        if (!lab || !lab.mineralType) { return; }

        if (lab.store[RESOURCE_ENERGY] <= 1000) {
            if (!hasTransferTask(room, ROOM_TRANSFER_TASK.BOOST_GET_ENERGY)) {
                addTransferTask(room, {
                    type: ROOM_TRANSFER_TASK.BOOST_GET_ENERGY,
                });
            }
            return;
        }
    }

    // 能量都够了
    room.memory.boost.state = BOOST_STATE.BOOST_WAIT;
    console.log('boost energy is ok');
}

export const boostClear = function (room: Room) {
    const boostTask = room.memory.boost;
    for (const i in boostTask.labsID) {
        const lab = Game.getObjectById<StructureLab>(boostTask.labsID[i]);

        if (lab && lab.mineralType) {
            if (!hasTransferTask(room, ROOM_TRANSFER_TASK.BOOST_CLEAR)) {
                addTransferTask(room, {
                    type: ROOM_TRANSFER_TASK.BOOST_CLEAR
                });
            }
            return;
        }
    }

    // 继续 boost
    if (hasTransferTask(room, ROOM_TRANSFER_TASK.BOOST_GET_RESOURCE)) return;
    // 清理完毕，没有任务了
    else if (!hasTransferTask(room, ROOM_TRANSFER_TASK.BOOST_CLEAR)) {
        console.log('boost clear is ok');

        if (room.memory.lab) { room.memory.lab.state = LAB_STATE.GET_TARGET; }
        return;
    }
}