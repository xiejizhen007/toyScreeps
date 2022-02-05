// memory 对象的信息
interface Memory {
    enemyRoom?: string[],
    reserverRoom?: string[],
    harvestRoom?: iHarvestRoom[],
    pbTeam?: {
        flagName?: string,
        attacker?: string,          // 记录 attacker 的名字
        docter?: string,            // docter 的名字
    }[],

    attackFlagQueue: string[],      // 攻击队列，记录 flag
    whiteList: string[],            // 白名单，记录对方名字
    avoidRoom: AvoidRoom[],         // 需要避开的房间
    roomNetwork: { [name: string]: RoomNetworkMemory },
}

interface RoomMemory {
    spawnTasks: any,
    lab?: {
        state?: string,
        lab1ID?: string,
        lab2ID?: string,
        labsID?: string[],
        cooldown?: number,
        transferTasks?: any,
        targetIndex?: number,
    },
    boost?: {
        state?: string,                     // boost 状态
        type?: string,
        resourceType?: ResourceConstant[],  // 所用化合物
        labsID?: Id<StructureLab>[],        // 用于 boost 的 lab
        count?: number,                     // 记录当前需要 boost 的数量
    },

    sources?: string[],
    powerTask?: pcTaskType[],

    transferTasks?: roomTransferTask[],
    exeTransferTasks?: roomTransferTask[],
    war?: boolean,
    powerSpawnID?: string,
    mineralID?: Id<Mineral>,
    reserverRoom?: string[],

    harvestRoom?: iHarvestRoom[],

    // tower
    towerState?: string,
    damagedStructure?: string,
    attackTarget?: string,

    // id
    nuker?: string,
    labs?: string[],        // 所有的 lab id

    wallHit?: number,       
    avoid?: boolean,        // 房间是否需要绕开
}

interface CreepMemory {
    role: string,
    room: string,
    isNeeded: boolean,
    work?: boolean,
    ready?: boolean,       
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
        portalFlag?: string,
    },
    // boost?: boolean,
    // boostType?: string,
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
    target?: string,        // 目标 id
    resourceType?: ResourceConstant,
    countTime?: number,     // 到岗时间

    // boost
    boost?: boolean,        // 是否需要 boost
    boostType?: string[],   // 需要 boost 的动作，如 "attack"，具体看 ./setting/BOOST_RESOURCE_TYPE
    boostLevel?: number,    // boost 等级，默认 boost 二级

    move?: MoveData,        // 缓存的路径等
}

interface PowerCreepMemory {
    powerSpawnID?: string,
}

interface FlagMemory {
    state?: string,         // powerbank 采集状态
}

interface CenterNetworkMemory {
    pos?: RoomPosition,
}

interface MRoomMemory {
    transportNetwork: TransportNetworkRequests,
}

// 原型拓展的信息
interface Room {
    addHarvestRoom(roomName: string): boolean,
    removeHarvestRoom(roomName: string): boolean,
    addRoleSpawnTask(role: string, isNeeded?: boolean, workRoomName?: string, flagName?: string): boolean,
    addSpawnTask(creep: Creep): boolean,
    addBoostRole(role: string, isNeeded: boolean, boostType: string[], level: number, workRoomName?: string, flagName?: string),
    addBoostCreep(creep: Creep);

    addTransferTask(task: roomTransferTask, priority?: number): number,
    // removeTransferTask(taskType: string): boolean,
    removeTransferTask(): boolean,
    // taskToExe(): void,
    hasTransferTask(taskType: string): boolean,
    getTransferTask(): roomTransferTask,

    // creepController
    addRoomCreepGroup(roomName: string): boolean,
    addRoomReserver(roomName: string): boolean,
    addMineral(): boolean,

    // powerCreepController
    powerWork(): boolean,
    usePower(): boolean,
    regenSource(): void,
    hasPowerTask(task: pcTaskType): boolean,
    addPowerTask(task: pcTaskType): boolean,
    removePowerTask(): boolean,

    // roomController
    labCheck(): void,

    // market
    buyPower(): void,
    sell(resourceType: ResourceConstant): ScreepsReturnCode,
    buy(resourceType: ResourceConstant): ScreepsReturnCode,
    checkBuy(resourceType: ResourceConstant): ScreepsReturnCode,

    // Room.ts
    my: boolean,
    creeps: Creep[],
    hostiles: Creep[],
    invaders: Creep[],
    sourceKeepers: Creep[],
    players: Creep[],
    structures: Structure[],
    structuresAll: Structure[],
    flags: Flag[],

    // extension.ts
    towers: StructureTower[],
    linkNetwork: any;
    registerRoom(): void,
    registerModule(): void,
    getStructures(structureType: StructureConstant): Structure[],
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

    // boost
    boost(): void,
    
    // tool
    clearBody(target: Structure): ScreepsReturnCode,
}

interface PowerCreep {
    work() : void,
}

interface StructureTower {
    work(): void,
}

interface StructurePowerSpawn {
    work(): void,
    generatePower(): void,
}

interface StructureSpawn {
    work(): void,
}

interface StructureTerminal {
    work(): void,
}

interface StructureLab {
    work(): void,
}

type roomTransferTask = iLabIn | iLabOut | iTower | iNuke | iPowerSpawn | iExtension | iBoostLab;

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

interface iBoostLab {
    type: string,
    resource: {
        id: string,
        type: ResourceConstant,
    }[],
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

interface iExtension {
    type: string
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

type pcTaskType = iRegenSource | iOperatePower;

interface iRegenSource {
    type: string,
    id: string,
}

interface iOperatePower {
    type: string,
    id: string,
}

type spawnTaskType = iSpawnTask;

interface iSpawnTask {
    role: string,
    room: string,
    isNeeded: boolean,
    task: iCreepTask,
}

interface iCreepTask {
    // 
    target?: string,

    // 资源 id
    resource?: string,
    source?: string,
    mineral?: string,
    // 建筑 id
    container?: string,
    newContainerID?: string,
    constructionSite?: string,
    link?: string,

    workRoomName?: string,
    flagName?: string,
    transferTask?: any,
}

interface MoveData {
    path: RoomPosition[],           // 路径
    priority: number,               // 移动优先级，以实现对穿，越低优先级越大
    destination: RoomPosition,      // 目标地
    standed?: boolean,              // 禁止对穿
}

interface MoveOptions {
    range?: number,                 // 目的地所范围，默认为 0
    ignoreCreeps?: boolean,         // 忽略 creep，默认为 false 
    avoidRoom?: string[],           // 避开的房间
}

interface AvoidRoom {
    roomName: string,               // 避开的房间名
    owner: string,                  // 记录一下房主名字，默认是 "Invader"
    ticksRemaining?: number,        // 主要是 npc 主房
}

// 任务属性
type taskTargetType = {
    id: string,
    pos: RoomPosition,
}

type taskOptions = {
    range: number,
}

type taskAttackTarget = Creep | Structure;
type taskBuildTarget = ConstructionSite;

interface HasId {
    id: Id<Structure> | Id<Creep>,
}

interface HasName {
    name: string,
}