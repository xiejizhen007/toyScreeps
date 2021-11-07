import { ROOM_TRANSFER_TASK } from "setting";

export const transfer = function(creep: Creep) {
    let task = creep.memory.exeTask;
    if (!task) {
        if (creep.room.memory.transferTasks && creep.room.memory.transferTasks.length > 0) {
            if (!creep.room.memory.exeTransferTasks) { creep.room.memory.exeTransferTasks = []; }

            creep.memory.exeTask = creep.room.memory.transferTasks[0];
            task = creep.memory.exeTask;
            creep.room.memory.exeTransferTasks.push(task);
            creep.room.memory.transferTasks.shift();
        }
        else {
            console.log('transfer: no task!');
            return;
        }
    }

    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.work = true;
    }
    else if (creep.store.getUsedCapacity() == 0) {
        creep.memory.work = false;
    }

    if (task.type == ROOM_TRANSFER_TASK.LAB_IN) {
        const resource = task.resource;
        if (!resource) { return; }

        let lab1 = Game.getObjectById<StructureLab>(resource[0].id);
        let lab2 = Game.getObjectById<StructureLab>(resource[1].id);
        if (!lab1 || !lab2) { return; }

        let lab;
        if (!lab1.mineralType) {
            lab = lab1;
        }
        else if (!lab2.mineralType) {
            lab = lab2;
        }
        else {
            lab = lab1.store[lab1.mineralType] <= lab2.store[lab2.mineralType] ? lab1 : lab2;
        }

        let terminal = creep.room.terminal;
        if (!terminal) { return; }

        if (creep.memory.work) {
            if (creep.pos.inRangeTo(lab, 1)) {
                if (lab == lab1) {
                    console.log('lab1: ' + creep.transfer(lab, resource[0].type));
                    creep.memory.exeTask.resource[0].amount -= creep.store.getUsedCapacity(resource[0].type);
                }
                else if (lab == lab2) {
                    console.log('lab2: ' + creep.transfer(lab, resource[1].type))
                    creep.memory.exeTask.resource[1].amount -= creep.store.getUsedCapacity(resource[1].type);
                }
            }
            else {
                creep.moveTo(lab);
            }
        }
        else {
            if (resource[0].amount == 0 && resource[1].amount == 0) {
                let index = creep.room.memory.exeTransferTasks.findIndex(task => task.type == ROOM_TRANSFER_TASK.LAB_IN);
                if (index >= 0) {
                    creep.room.memory.exeTransferTasks.splice(index, 1);
                    creep.memory.exeTask = undefined;
                }
            }

            if (creep.pos.inRangeTo(terminal, 1)) {
                if (lab == lab1) {
                    creep.withdraw(terminal, resource[0].type, creep.store.getFreeCapacity() < resource[0].amount ? creep.store.getFreeCapacity() : resource[0].amount);
                    creep.memory.work = true;
                }
                else if (lab == lab2) {
                    creep.withdraw(terminal, resource[1].type, creep.store.getFreeCapacity() < resource[1].amount ? creep.store.getFreeCapacity() : resource[1].amount);
                    creep.memory.work = true;
                }
            }
            else {
                creep.moveTo(terminal);
            }
        }
    }
    else if (task.type == ROOM_TRANSFER_TASK.LAB_OUT) {
        let labsID = creep.memory.labsID;
        if (!labsID) {
            let labs = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_LAB;
                }
            });

            for (let i = 0; i < labs.length; i++) {
                if (!labsID.includes[labs[i].id]) {
                    labsID.push(labs[i].id);
                }
            }
        }

        if (!labsID) { return; }

        let terminal = creep.room.terminal;
        if (!terminal) { return; }

        if (creep.memory.work) {
            if (creep.pos.inRangeTo(terminal, 1)) {
                for (let type in creep.store) {
                    let resourceType = type as ResourceConstant;
                    creep.transfer(terminal, resourceType);
                }
            }
            else {
                creep.moveTo(terminal);
            }
        }
        else {
            for (let i = 0; i < labsID.length; i++) {
                let lab = Game.getObjectById<StructureLab>(labsID[i]);
                if (lab && lab.mineralType) {
                    if (creep.pos.inRangeTo(lab, 1)) {
                        if (lab.store[lab.mineralType] > creep.store.getFreeCapacity()) {
                            creep.withdraw(lab, lab.mineralType);
                        }
                        else {
                            creep.withdraw(lab, lab.mineralType, lab.store[lab.mineralType]);
                        }
                    }
                    else {
                        creep.moveTo(lab);
                    }
                    return;
                }
            }        

            let index = creep.room.memory.exeTransferTasks.findIndex(task => task.type == ROOM_TRANSFER_TASK.LAB_OUT);
            if (index >= 0) {
                creep.room.memory.exeTransferTasks.splice(index, 1);
                creep.memory.exeTask = undefined;
            }
        }
    }
}