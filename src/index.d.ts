interface Memory {
    enemyRoom?: string[],
}

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
    powerSpawnID?: string,
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
        newContainerID?: string,
        constructionSiteID?: string,
        linkID?: string,
        transferTask?: any,
        targetID?: string,
        mineralID?: string,
    },
    boost?: boolean,
    boostType?: string,
    labsID?: any,
    exeTask?: any,
    powerSpawnID?: string,
    farMove?: {
        index?: number,
        paths?: RoomPosition[],
        targetPos?: RoomPosition,
    }
}

interface Creep {
    hello(): void,
    work(): void,

    farGoTo(target: RoomPosition): CreepMoveReturnCode,
    findPath(target: RoomPosition): void,
    getEnergyFrom(target: Structure | Source): ScreepsReturnCode,
}

interface PowerCreepMemory {
    powerSpawnID?: string,
}

interface PowerCreep {
    work() : void,
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