import { ROOM_TRANSFER_TASK } from "setting";
import { BOOST_RESOURCE } from "setting";

export const creepLab = {
    /**
     * 
     * @param creep 
     */
    run: function(creep: Creep) {
        if (!creep || creep.spawning) {
            return;
        }

        // spawnTask
        if (creep.ticksToLive < 50 && creep.memory.isNeeded) {
            let room = Game.rooms[creep.memory.room];
            if (!room) { return; }

            room.memory.spawnTasks.push({role: 'creepLab', room: creep.memory.room, isNeeded: true, task: creep.memory.task});
            creep.memory.isNeeded = false;
            console.log('new task by ' + creep.name);
        }

        let lab1 = Game.getObjectById(creep.room.memory.lab.lab1ID) as StructureLab;
        let lab2 = Game.getObjectById(creep.room.memory.lab.lab2ID) as StructureLab;
        if (!lab1 || !lab2) {
            console.log('lab 不存在');
            return;
        }

        let transferTask;
        if (creep.room.memory.transferTasks && creep.room.memory.transferTasks.length > 0) {
            transferTask = creep.room.memory.transferTasks[0];
        }

        let terminal = creep.room.terminal;
        if (!terminal || !transferTask) {
            return;
        }

        if (clearLab(creep)) {
            return;
        }

        if (creep.store.getFreeCapacity() == 0) {
            // console.log('set true');
            creep.memory.work = true;
        }
        else if (creep.store.getUsedCapacity() == 0) {
            creep.memory.work = false;
        }

        // console.log('creepLab: work' + creep.memory.work);

        if (creep.memory.work) {
            // console.log('creepLab: work');
            if (transferTask.type == ROOM_TRANSFER_TASK.LAB_IN) {
                let flag = Game.flags[creep.room.name + 'Lab'];
                if (flag) {
                    let resource = transferTask.resource;
                    if (creep.pos.isEqualTo(flag.pos)) {
                        if (creep.store.getUsedCapacity(resource[0].type) > 0) {
                            creep.transfer(lab1, resource[0].type);
                        }
                        else if (creep.store.getUsedCapacity(resource[1].type) > 0) {
                            creep.transfer(lab2, resource[1].type);
                        }
                        else {
                            creep.memory.work = false;
                        }
                    }
                    else {
                        creep.moveTo(flag);
                    }
                }
            }
            else if (transferTask.type == ROOM_TRANSFER_TASK.LAB_OUT) {
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
        }
        else {
            let resource = transferTask.resource;
            if (transferTask.type == ROOM_TRANSFER_TASK.LAB_IN) {
                if (terminal.store[resource[0].type] == 0 || terminal.store[resource[1].type] == 0 || (lab1.store[resource[0].type] > 1500 && lab2.store[resource[1].type] > 1500)) {
                    creep.room.memory.transferTasks.shift();
                    return;
                }

                if (!creep.pos.inRangeTo(terminal.pos, 1)) {
                    creep.moveTo(terminal);
                    return;
                }

                // 身上还有东西
                if (creep.store.getUsedCapacity() > 0) {
                    for (let type in creep.store) {
                        let resourceType = type as ResourceConstant;
                        creep.transfer(terminal, resourceType);
                    }
                    return;
                }

                let lab = lab1.store[resource[0].type] < lab2.store[resource[1].type] ? lab1 : lab2;
                if (lab == lab1) {
                    let tmp = creep.withdraw(terminal, resource[0].type);
                }
                else if (lab == lab2) {
                    let tmp = creep.withdraw(terminal, resource[1].type);
                }
            }
            else if (transferTask.type == ROOM_TRANSFER_TASK.LAB_OUT) {
                let labsID = creep.room.memory.lab.labsID;

                if (lab1 && lab1.store[lab1.mineralType] > 0) {
                    if (creep.pos.inRangeTo(lab1, 1)) {
                        if (lab1.store[lab1.mineralType] > creep.store.getFreeCapacity()) {
                            creep.withdraw(lab1, lab1.mineralType);
                        }
                        else {
                            creep.withdraw(lab1, lab1.mineralType, lab1.store[lab1.mineralType]);
                        }
                    }
                    else {
                        creep.moveTo(lab1);
                    }
                    return;
                }

                if (lab2 && lab2.store[lab2.mineralType] > 0) {
                    if (creep.pos.inRangeTo(lab2, 1)) {
                        if (lab2.store[lab2.mineralType] > creep.store.getFreeCapacity()) {
                            creep.withdraw(lab2, lab2.mineralType);
                        }
                        else {
                            creep.withdraw(lab2, lab2.mineralType, lab2.store[lab2.mineralType]);
                        }
                    }
                    else {
                        creep.moveTo(lab2);
                    }
                    return;
                }

                for (let i = 0; i < labsID.length; i++) {
                    let lab = Game.getObjectById(labsID[i]) as StructureLab;
                    if (lab && lab.store[lab.mineralType] > 0) {
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
                creep.room.memory.transferTasks.shift();
                console.log('remove output task');
            }
        }
    }
};

export const clearLab = function(creep: Creep) {
    let lab1 = Game.getObjectById(creep.room.memory.lab.lab1ID) as StructureLab;
    let lab2 = Game.getObjectById(creep.room.memory.lab.lab2ID) as StructureLab;
    if (!lab1 || !lab2) {
        console.log('lab 不存在');
        return false;
    }

    let transferTask;
    if (creep.room.memory.transferTasks && creep.room.memory.transferTasks.length > 0) {
        transferTask = creep.room.memory.transferTasks[0];
    }


    let terminal = creep.room.terminal;
    if (!terminal || !transferTask) {
        return false;
    }

    // console.log('resourceType: ' + transferTask.resource[0].type);

    if (transferTask.type == ROOM_TRANSFER_TASK.LAB_IN && lab1.mineralType && transferTask.resource[0].type != lab1.mineralType) {
        if (creep.store.getFreeCapacity() > 0) {
            if (creep.pos.inRangeTo(lab1, 1)) {
                let amount = lab1.store[lab1.mineralType] < creep.store.getFreeCapacity() ? lab1.store[lab1.mineralType] : creep.store.getFreeCapacity();
                creep.withdraw(lab1, lab1.mineralType, amount);
            }
            else {
                creep.moveTo(lab1);
            }
        }
        else {
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
        return true;
    }
    else if (transferTask.type == ROOM_TRANSFER_TASK.LAB_IN && lab2.mineralType && transferTask.resource[1].type != lab2.mineralType) {
        if (creep.store.getFreeCapacity() > 0) {
            if (creep.pos.inRangeTo(lab2, 1)) {
                let amount = lab2.store[lab2.mineralType] < creep.store.getFreeCapacity() ? lab2.store[lab2.mineralType] : creep.store.getFreeCapacity();
                creep.withdraw(lab2, lab2.mineralType, amount);
            }
            else {
                creep.moveTo(lab2);
            }
        }
        else {
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
        return true;
    }
    else if (transferTask.type == ROOM_TRANSFER_TASK.LAB_IN) { 
        for (let type in creep.store) {
            // console.log('transferTask ' + transferTask.resource.find(resourceType => resourceType.type == RESOURCE_CATALYST));
            if (transferTask.resource.find(resourceType => resourceType.type == type)) {
                return false;
            }
            else {
                if (creep.pos.inRangeTo(terminal, 1)) {
                    let resourceType = type as ResourceConstant;
                    creep.transfer(terminal, resourceType);
                }
                else {
                    creep.moveTo(terminal);
                }
                return true;
            }
        }
    }

    return false;
}