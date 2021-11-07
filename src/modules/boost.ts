import { ROOM_TRANSFER_TASK } from "setting";
import { addTransferTask } from "./utils";

/**
 * 
 * @param room 执行 boost 的房间
 * @param creep boost 的对象
 */
export const boostCreep = function(room: Room, creep: Creep) {
    if (!room.memory.boost) { room.memory.boost = {}; }

    if (!room.memory.boost.labsID) {
        room.memory.boost.labsID = new Array();
        let labs = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LAB;
            }
        });

        for (let i = 0; i < labs.length; i++) {
            if (!room.memory.boost.labsID.includes(labs[i].id)) {
                room.memory.boost.labsID.push(labs[i]);
            }
        }
    }

    let activeLab : StructureLab[] = [];
    for (const i in room.memory.boost.labsID) {
        const lab = Game.getObjectById<StructureLab>(room.memory.boost.labsID[i]);
        if (lab) activeLab.push(lab);
    }

    const boostResults = activeLab.map(lab => lab.boostCreep(creep));
    if (boostResults.includes(OK)) {
        addTransferTask(room, {
            type: ROOM_TRANSFER_TASK.BOOST_GET_RESOURCE,
        });
        addTransferTask(room, {
            type: ROOM_TRANSFER_TASK.BOOST_GET_ENERGY,
        });

        return OK;
    }
    else {
        return ERR_NOT_IN_RANGE;
    }
}