interface RoomMemory {
    spawnTasks: any,
    lab?: {
        state?: string,
        lab1ID?: string,
        lab2ID?: string,
        labsID?: any,
        cooldown?: number,
        transferTasks?: any,
        targetIndex?: number,
    },
    boost?: {
        state?: string,
        type?: string,
        labsID?: any,
    },

    transferTasks?: any[],
    exeTransferTasks?: any[],
    war?: boolean,
}

interface CreepMemory {
    role: string,
    room: string,
    isNeeded: boolean,
    work?: boolean,
    linkControllerID?: string,
    containerControllerID?: string,
    linkCenterID?: string,
    state?: string,
    task?: {
        workRoomName?: string,
        flagName?: string,
        resourceID?: string,
        sourceID?: string,
        containerID?: string,
        linkID?: string,
        transferTask?: any,
    },
    boost?: boolean,
    boostType?: string,
    labsID?: any,

    exeTask?: any,
}

type roomTransferTask = iLabIn | iLabOut;

interface Room {
    // 传输任务
    addTransferTask(task: roomTransferTask) : number
    hasTransferTask(taskType: string) : boolean
}

interface iLabIn {
    type: string,
    resource: {
        id: string,
        type: ResourceConstant,
        amount: number,
    }[],
}

interface iLabOut {
    type: string,
    labsID: string[],
}