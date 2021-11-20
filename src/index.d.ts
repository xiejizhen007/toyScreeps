// memory 对象的信息
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

    sources?: string[],
    powerTask?: pcTaskType[],

    transferTasks?: roomTransferTask[],
    exeTransferTasks?: roomTransferTask[],
    war?: boolean,
    powerSpawnID?: string,
    mineralID?: string,
    reserverRoom?: string[],

    harvestRoom?: iHarvestRoom[],

    // tower
    towerState?: string,
    damagedStructure?: string,
    attackTarget?: string,
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
    exeTask?: roomTransferTask,
    powerSpawnID?: string,
    farMove?: {
        index?: number,
        paths?: RoomPosition[],
        targetPos?: RoomPosition,
    },

    resourceID?: string,    // 掉在地上资源的 id
    tombstoneID?: string,   // 墓碑 id
    sourceID?: string,      // 能量矿 id
}

interface PowerCreepMemory {
    powerSpawnID?: string,
}

// 原型拓展的信息
interface Room {
    addHarvestRoom(roomName: string): boolean,
    removeHarvestRoom(roomName: string): boolean,
    addRoleSpawnTask(role: string, isNeeded?: boolean, workRoomName?: string, flagName?: string): boolean,
    addSpawnTask(creep: Creep): boolean,

    addTransferTask(task: roomTransferTask, priority?: number): number,
    // removeTransferTask(taskType: string): boolean,
    removeTransferTask(): boolean,
    // taskToExe(): void,
    hasTransferTask(taskType: string): boolean,

    // creepController
    addRoomCreepGroup(roomName: string): boolean,
    addRoomReserver(roomName: string): boolean,

    // powerCreepController
    powerWork(): boolean,
    usePower(): boolean,
    regenSource(): void,
    hasPowerTask(task: pcTaskType): boolean,
    addPowerTask(task: pcTaskType): boolean,
    removePowerTask(): boolean,

    // market
    buyPower(): void,
}

interface Creep {
    hello(): void,
    work(): void,

    goTo(target: RoomPosition): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND,
    transferTo(target: Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode,
    withdrawFrom(target: Structure | Tombstone, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode,
    farGoTo(target: RoomPosition): CreepMoveReturnCode,
    findPath(target: RoomPosition): void,
    getEnergyFrom(target: Structure | Source): ScreepsReturnCode,
    pickupFrom(target: Resource): ScreepsReturnCode,
}

interface PowerCreep {
    work() : void,
}

interface StructureTower {
    work(): void,
}

interface StructurePowerSpawn {
    generatePower(): void,
}



type roomTransferTask = iLabIn | iLabOut | iTower | iNuke | iPowerSpawn;

// 任务类型
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

interface iTower {
    type: string,
    id: string,
}

interface iNuke {
    type: string,
    id: string,
    resourceType: ResourceConstant,     // 当前需要运输的资源类型
}

interface iPowerSpawn {
    type: string,
    id: string,
    resourceType: ResourceConstant,     // 当前需要运输的资源类型
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

type pcTaskType = iRegenSource;

interface iRegenSource {
    type: string,
    id: string,
}