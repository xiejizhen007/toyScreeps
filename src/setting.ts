export const roomSpawn = {
    1: {
        harvester: { work: 1, carry: 1, move: 1},
        upgrader: {work: 1, carry: 1, move: 2},
        builder: {work: 1, carry: 1, move: 1},
        queen: {carry: 2, move: 2},
        signer: {move: 1},
    },
    2: {
        harvester: { work: 2, carry: 1, move: 1},
        upgrader: {work: 2, carry: 1, move: 1},
        builder: {work: 1, carry: 1, move: 1},
        queen: {carry: 3, move: 3},
        signer: {move: 1},
    },
    3: {
        builder: {work: 2, carry: 2, move: 2},
        harvester: { work: 2, carry: 1, move: 1},
        queen: {carry: 3, move: 3},
        upgrader: {work: 3, carry: 2, move: 3},
        repairer: {work: 2, carry: 3, move: 3},
        outputer: {carry: 2, move: 2},
        signer: {move: 1},
        claimer: {claim: 1, move: 1},
        pioneer: {work: 3, carry: 3, move: 3},
    },
    4: {
        builder: {work: 5, carry: 5, move: 2},
        harvester: { work: 5, carry: 1, move: 1},
        queen: {carry: 5, move: 5},
        upgrader: {work: 5, carry: 3, move: 3},
        repairer: {work: 2, carry: 3, move: 3},
        outputer: {carry: 4, move: 4},
        transfer: {carry: 5, move: 5},
        claimer: {claim: 1, move: 1},
        signer: {move: 1},
    },
    5: {
        builder: {work: 5, carry: 5, move: 2},
        harvester: { work: 5, carry: 1, move: 1},
        queen: {carry: 5, move: 5},
        upgrader: {work: 8, carry: 6, move: 8},
        repairer: {work: 2, carry: 3, move: 3},
        outputer: {carry: 4, move: 4},
        transfer: {carry: 8, move: 8},
    },
    6: {
        upgrader: {work: 12, carry: 6, move: 4},
        queen: {carry: 6, move: 6},
        king: {carry: 6, move: 6},
        builder: {work: 4, carry: 6, move: 6},
        outputer: {carry: 6, move: 6},
        harvester: {work: 6, carry: 1, move: 3},
        harvesterRoom: {work: 6, carry: 10, move: 8},
        harvesterMineral: {work: 5, carry: 6, move: 6},
        repairer: {work: 4, carry: 4, move: 4},
        transfer: {carry: 8, move: 8},
        transferRoom: {carry: 15, move: 15}, 
        claimer: {claim: 1, move: 4},
        reserver: {claim: 2, move: 2},
        manager: {carry: 1, move: 1},
        tmp: {carry: 5, move: 5},
        thief: {carry: 15, move: 15},
    },
    7: {
        harvester: {work: 6, carry: 1, move: 3}, 
        transfer: {carry: 10, move: 10},
        transferRoom: {carry: 20, move: 20},
        harvesterRoom: {work: 6, carry: 4, move: 6},
        repairer: {work: 6, carry: 6, move: 6},
        repairerWall: {work: 5, carry: 10, move: 10},
        upgrader: {work: 20, carry: 10, move: 10},
        builder: {work: 8, carry: 8, move: 8},
        outputer: {carry: 15, move: 15},
        king: {carry: 10, move: 10},
        queen: {carry: 10, move: 10},
        harvesterMineral: {work: 15, carry: 10, move: 25},
        soldier: {tough: 9, attack: 16, move: 25},
        docter: {tough: 9, heal: 16, move: 25},
        creepLab: {carry: 10, move: 10},
        test: {attack: 1, heal: 1, move: 2},
        creepTransfer: {carry: 4, move: 4},
        reserver: {claim: 2, move: 2},
        manager: {carry: 1, move: 1},
        tmp: {carry: 5, move: 5},
        farmove: {work: 2, carry: 1, move: 2},
        claimer: {move: 5, claim: 1},
        remoteSoldier: {tough: 5, attack: 10, heal: 5, move: 20},
        pioneer: {work: 10, carry: 10, move: 25, heal: 5},
        thief: {carry: 20, move: 20},
    },
    8: {
        harvester: {work: 10, carry: 1, move: 5}, 
        transfer: {carry: 16, move: 16},
        transferRoom: {carry: 20, move: 20},
        repairer: {work: 6, carry: 6, move: 6},
        repairerWall: {work: 5, carry: 10, move: 10},
        upgrader: {work: 10, carry: 10, move: 20},
        builder: {work: 1, carry: 1, move: 2},
        outputer: {carry: 10, move: 10},
        king: {carry: 20, move: 5},
        queen: {carry: 20, move: 20},
        harvesterMineral: {work: 15, carry: 10, move: 25},
        soldier: {tough: 9, attack: 16, move: 25},
        docter: {tough: 9, heal: 16, move: 25},
        creepLab: {carry: 10, move: 10},
        test: {tough: 1, attack: 1, heal: 1, move: 2},
        creepTransfer: {carry: 4, move: 4},
        creepPS: {carry: 10, move: 10},
        harvesterRoom: {work: 6, carry: 4, move: 6},
        reserver: {claim: 2, move: 2},
        manager: {carry: 5, move: 5},
        tmp: {carry: 32, move: 16},
        powerHarvester: {work: 10, carry: 1, move: 1},
        claimer: {tough: 15, move: 21, claim: 1, heal: 5},
        remoteSoldier: {tough: 5, attack: 10, heal: 5, move: 20},
        pioneer: {work: 10, carry: 10, move: 25, heal: 5},
        deposit: {work: 15, carry: 10, move: 25},       // 挖沉积物
        // power bank
        pbAttacker: {move: 1, attack: 1},
        pbDocter: {move: 1, heal: 1},
        superSoldier: {tough: 12, ranged_attack: 5, move: 10, heal: 23},
        superDismantle: {work: 40, move: 10},
        superDocter: {tough: 12, move: 10, heal: 28},
        // superSoldier: {move: 1}, 
        worker: {move: 25, work: 15, carry: 10},
        fillNuker: {carry: 10, move: 5},
        thief: {carry: 20, move: 20},
        harvesterTest: {work: 10, carry: 5, move: 10},
        kingTest: {carry: 5, move: 5},
    }
}

// 后期再改
// TODO: 根据房间等级取 body array，当房间能量不足时，往更低等级取
export const bodyArray = {
    // 挖能量
    ['harvester']: [
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1},
    ],

    // 房间物流
    ['queen']: [
        { [MOVE]: 2, [CARRY]: 2 },
        { [MOVE]: 2, [CARRY]: 2 },
        { [MOVE]: 2, [CARRY]: 2 },
        { [MOVE]: 2, [CARRY]: 2 },
        { [MOVE]: 2, [CARRY]: 2 },
        { [MOVE]: 2, [CARRY]: 2 },
        { [MOVE]: 2, [CARRY]: 2 },
        { [MOVE]: 2, [CARRY]: 2 },
    ],

    // 中央物流
    ['king']: [
        { },
        { },
        { },
        // storage
        { },
        // link
        { [CARRY]: 1, [MOVE]: 1},
        // terminal
        { [CARRY]: 1, [MOVE]: 1},
        { [CARRY]: 1, [MOVE]: 1},
        { [CARRY]: 1, [MOVE]: 1},
    ],

    // 升级
    ['upgrader']: [
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 2},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 2},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 2},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 2},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 2},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 2},
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 2},
    ],

    // 日常工作，修建筑，刷墙
    ['worker']: [
        { [WORK]: 1, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 1, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 1, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 1, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 1, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 1, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 1, [CARRY]: 1, [MOVE]: 1},
        { [WORK]: 1, [CARRY]: 1, [MOVE]: 1},
    ],
}

export const CREEP_STATE = {
    PREPARE: 'creepPrepare',
    TARGET: 'creepTarget',
    BACK: 'creepBack',
    SOURCE: 'creepSource',
}

export const LAB_STATE = {
    WORKING: 'working',
    BOOST: 'boost',
    IN_RESOURCE: 'inResource',
    OUT_RESOURCE: 'outResource',
    INIT: 'init',
    GET_TARGET: 'getTarget',
};

export const ROOM_TRANSFER_TASK = {
    LAB_IN: 'labIn',
    LAB_OUT: 'labOut',
    BOOST_GET_RESOURCE: 'boostGetResource',
    BOOST_GET_ENERGY: 'boostGetEnergy',
    BOOST_CLEAR: 'boostClear',
    
    // 填充塔
    FILL_TOWER: 'fillTower',
    FILL_NUKER: 'fillNuker',
    FILL_EXTENSION: 'fillExtension',
    FILL_POWERSPAWN: 'fillPowerSpawn',
};

export const LAB_TRANSFER_TASK = {
    LAB_IN: 'labIn',
    LAB_OUT: 'labOut',
    LAB_IN_ENERGY: 'labInEnergy',
};

export const BOOST_STATE = {
    BOOST_GET_RESOURCE: 'boostGetResource',         // 获取准备 boost 的资源
    BOOST_GET_ENERGY: 'boostGetEnergy',             // 填充 lab 的能量
    BOOST_WAIT: 'boostWait',                        // 等待
    BOOST_CLEAR: 'boostClear',                      // boost 结束，把用到的资源放回 terminal
    BOOST_READY: 'boostReady',                      // 填充完毕
}

export const towerCheckStructure = 5;
export const towerCheckEnergy = 10;
export const towerEnergyLimit = 600;
export const TOWER_STATE = {
    REPAIR_STRUCTURE: 'repairStructure',
    HEAL_CREEP: 'healCreep',
    // ATTACK_CREEP: 'attackCreep',
    DEFENSE_NPC: 'defenseNpc',
    DEFENSE_PLAYER: 'defensePlayer',
}

/**
 * powerbank 采集状态
 */
export const PB_STATE = {
    ATTACK: 'pbAttack',         // 正在攻击 pb   
    PREPARE: 'pbPrepare',       // pb 快坏了，叫 transfer 来搬
    TRANSFER: 'pbTransfer',     // pb 被拆了，往回送
}

export const BOOST_RESOURCE = {
    war: [
        // attack
        RESOURCE_CATALYZED_GHODIUM_ACID,
        // heal
        RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
        // move
        RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
        // tough
        RESOURCE_CATALYZED_GHODIUM_ALKALIDE,
        // ranged attack
        RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
    ],
    upgrade: [
        // 二级化合物
        // RESOURCE_GHODIUM_ACID,
        // 三级化合物
        RESOURCE_CATALYZED_GHODIUM_ACID,
    ],
}

/**
 * 强化需要使用的资源类型
 * 分为三个等级
 */
export const BOOST_RESOURCE_TYPE = {
    attack: [
        "UH",
        "UH2O",
        "XUH2O",
    ],

    harvest: [
        "UO",
        "UHO2",
        "XUHO2",
    ],

    carry: [
        "KH",
        "KH2O",
        "XKH2O",
    ],

    // rangedAttack
    ranged: [
        "KO",
        "KHO2",
        "XKHO2",
    ],

    // repair and build
    repair: [
        "LH",
        "LH2O",
        "XLH2O",
    ],

    heal: [
        "LO",
        "LHO2",
        "XLHO2",
    ],

    dismantle: [
        "ZH",
        "ZH2O",
        "XZH2O",
    ],

    move: [
        "ZO",
        "ZHO2",
        "XZHO2",
    ],

    upgrade: [
        "GH",
        "GH2O",
        "XGH2O",
    ],

    tough: [
        "GO",
        "GHO2",
        "XGHO2",
    ]
}

export const PC_TASK = {
    REGEN_SOURCE : 'regenSource',
    OPERATE_POWER: 'operatePower',
}

export const labTarget = [
    // 基础化合物
    { target: RESOURCE_UTRIUM_LEMERGITE, number: 2000},
    { target: RESOURCE_ZYNTHIUM_KEANITE, number: 2000},
    { target: RESOURCE_HYDROXIDE, number: 2000},
    { target: RESOURCE_GHODIUM, number: 5000},

    // attack
    { target: RESOURCE_CATALYZED_UTRIUM_ACID, number: 6000},  
    { target: RESOURCE_UTRIUM_ACID, number: 3000}, 
    { target: RESOURCE_UTRIUM_HYDRIDE, number: 3000},

    // ranged attack
    { target: RESOURCE_CATALYZED_KEANIUM_ALKALIDE, number: 6000},
    { target: RESOURCE_KEANIUM_ALKALIDE, number: 3000}, 
    { target: RESOURCE_KEANIUM_OXIDE, number: 3000},

    // move
    { target: RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE, number: 6000}, 
    { target: RESOURCE_ZYNTHIUM_ALKALIDE, number: 3000}, 
    { target: RESOURCE_ZYNTHIUM_OXIDE, number: 3000},

    // tough
    { target: RESOURCE_CATALYZED_GHODIUM_ALKALIDE, number: 6000}, 
    { target: RESOURCE_GHODIUM_ALKALIDE, number: 2000}, 
    { target: RESOURCE_GHODIUM_OXIDE, number: 3000},

    // heal
    { target: RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE, number: 6000},
    { target: RESOURCE_LEMERGIUM_ALKALIDE, number: 3000}, 
    { target: RESOURCE_LEMERGIUM_OXIDE, number: 3000},

    // dismantle
    { target: RESOURCE_CATALYZED_ZYNTHIUM_ACID, number: 4000},
    { target: RESOURCE_ZYNTHIUM_ACID, number: 3000}, 
    { target: RESOURCE_ZYNTHIUM_HYDRIDE, number: 3000},

    // upgrader
    { target: RESOURCE_CATALYZED_GHODIUM_ACID, number: 4000},   
    { target: RESOURCE_GHODIUM_ACID, number: 3000}, 
    { target: RESOURCE_GHODIUM_HYDRIDE, number: 3000},

    { target: RESOURCE_CATALYZED_UTRIUM_ALKALIDE, number: 3000},    // harvester
    { target: RESOURCE_UTRIUM_ALKALIDE, number: 3000}, 
    { target: RESOURCE_UTRIUM_OXIDE, number: 3000},

    { target: RESOURCE_CATALYZED_KEANIUM_ACID, number: 3000},       // carry
    { target: RESOURCE_KEANIUM_ACID, number: 3000}, 
    { target: RESOURCE_KEANIUM_HYDRIDE, number: 3000},

    { target: RESOURCE_CATALYZED_LEMERGIUM_ACID, number: 3000},     // repairer
    { target: RESOURCE_LEMERGIUM_ACID, number: 3000}, 
    { target: RESOURCE_LEMERGIUM_HYDRIDE, number: 3000},
];

export const reactionResource = {
    // 三级化合物
    [RESOURCE_CATALYZED_UTRIUM_ACID]: [RESOURCE_UTRIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_UTRIUM_ALKALIDE]: [RESOURCE_UTRIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_KEANIUM_ACID]: [RESOURCE_KEANIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_KEANIUM_ALKALIDE]: [RESOURCE_KEANIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_LEMERGIUM_ACID]: [RESOURCE_LEMERGIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: [RESOURCE_LEMERGIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_ZYNTHIUM_ACID]: [RESOURCE_ZYNTHIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: [RESOURCE_ZYNTHIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_GHODIUM_ACID]: [RESOURCE_GHODIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_GHODIUM_ALKALIDE]: [RESOURCE_GHODIUM_ALKALIDE, RESOURCE_CATALYST],

    // 二级化合物
    [RESOURCE_UTRIUM_ACID]: [RESOURCE_UTRIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_UTRIUM_ALKALIDE]: [RESOURCE_UTRIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_KEANIUM_ACID]: [RESOURCE_KEANIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_KEANIUM_ALKALIDE]: [RESOURCE_KEANIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_LEMERGIUM_ACID]: [RESOURCE_LEMERGIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_LEMERGIUM_ALKALIDE]: [RESOURCE_LEMERGIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_ZYNTHIUM_ACID]: [RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_ZYNTHIUM_ALKALIDE]: [RESOURCE_ZYNTHIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_GHODIUM_ACID]: [RESOURCE_GHODIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_GHODIUM_ALKALIDE]: [RESOURCE_GHODIUM_OXIDE, RESOURCE_HYDROXIDE],

    // 一级化合物
    [RESOURCE_UTRIUM_HYDRIDE]: [RESOURCE_HYDROGEN, RESOURCE_UTRIUM],
    [RESOURCE_UTRIUM_OXIDE]: [RESOURCE_OXYGEN, RESOURCE_UTRIUM],
    [RESOURCE_KEANIUM_HYDRIDE]: [RESOURCE_HYDROGEN, RESOURCE_KEANIUM],
    [RESOURCE_KEANIUM_OXIDE]: [RESOURCE_OXYGEN, RESOURCE_KEANIUM],
    [RESOURCE_LEMERGIUM_HYDRIDE]: [RESOURCE_HYDROGEN, RESOURCE_LEMERGIUM],
    [RESOURCE_LEMERGIUM_OXIDE]: [RESOURCE_OXYGEN, RESOURCE_LEMERGIUM],
    [RESOURCE_ZYNTHIUM_HYDRIDE]: [RESOURCE_HYDROGEN, RESOURCE_ZYNTHIUM],
    [RESOURCE_ZYNTHIUM_OXIDE]: [RESOURCE_OXYGEN, RESOURCE_ZYNTHIUM],
    [RESOURCE_GHODIUM_HYDRIDE]: [RESOURCE_HYDROGEN, RESOURCE_GHODIUM],
    [RESOURCE_GHODIUM_OXIDE]: [RESOURCE_OXYGEN, RESOURCE_GHODIUM],

    // 基础化合物
    [RESOURCE_HYDROXIDE] : [RESOURCE_OXYGEN, RESOURCE_HYDROGEN],
    [RESOURCE_ZYNTHIUM_KEANITE]: [RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM],
    [RESOURCE_UTRIUM_LEMERGITE]: [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM],
    [RESOURCE_GHODIUM]: [RESOURCE_ZYNTHIUM_KEANITE, RESOURCE_UTRIUM_LEMERGITE],
}

// 最大冷却时间
export const DEPOSIT_MAX_COOLDOWN = 200;

// 任务名
export const TASK_NAME = {
    ATTACK: "attack",
}


export const MEMORY = {
    ROOM_NETWORK: "RoomNetwork",
}