interface Memory {
    enemyRoom?: string[],
    reserverRoom?: string[],
    harvestRoom?: iHarvestRoom[],
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
    mineralID?: string,
    reserverRoom?: string[],

    harvestRoom?: iHarvestRoom[],
}

interface Room {
    addHarvestRoom(roomName: string): boolean,
    removeHarvestRoom(roomName: string): boolean,
    addRoleSpawnTask(role: string, isNeeded?: boolean, workRoomName?: string, flagName?: string): boolean,
    addSpawnTask(creep: Creep): boolean,

    // creepController
    addRoomCreepGroup(roomName: string): boolean,
    addRoomReserver(roomName: string): boolean,
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

    goTo(target: RoomPosition): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND,
    transferTo(target: Structure, resourceType: ResourceConstant): ScreepsReturnCode,
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
    resource?: {
        id: string,
        type: ResourceConstant,
        amount: number,
    }[],
}

interface iLabOut {
    type: string,
    labsID?: string[],
}

type reserverRoomType = iReserverRoom;

interface iReserverRoom {
    roomName: string,       // 外矿房间
    cooldown?: number,      // npc 的刷新时间
    hasReserver?: boolean   // 当前有人预定了
    sourceFlag?: {
        id: string,
        lock: boolean,
    }[],
}

interface iHarvestRoom {
    // sourceRoom: string,
    roomName: string,
    cooldown?: number,
    hasReserver?: boolean,
}