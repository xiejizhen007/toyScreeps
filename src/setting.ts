export const roomSpawn = {
    1: {
        harvester: { work: 1, carry: 1, move: 1},
    },
    2: {
        harvester: { work: 2, carry: 1, move: 1},
    },
    3: {
        builder: {work: 1, carry: 2, move: 2},
        harvester: { work: 3, carry: 1, move: 1},
        queen: {carry: 3, move: 3},
        upgrader: {work: 3, carry: 3, move: 3},
        repairer: {work: 2, carry: 3, move: 3},
        outputer: {carry: 4, move: 4},
    },
    4: {
        builder: {work: 5, carry: 5, move: 2},
        harvester: { work: 5, carry: 1, move: 1},
        queen: {carry: 5, move: 5},
        upgrader: {work: 5, carry: 5, move: 3},
        repairer: {work: 2, carry: 3, move: 3},
        outputer: {carry: 4, move: 4},
        transfer: {carry: 8, move: 8},
    },
    5: {
        builder: {work: 5, carry: 5, move: 2},
        harvester: { work: 5, carry: 1, move: 1},
        queen: {carry: 5, move: 5},
        upgrader: {work: 8, carry: 5, move: 3},
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
    },
    7: {
        harvester: {work: 6, carry: 1, move: 3}, 
        transfer: {carry: 10, move: 10},
        transferRoom: {carry: 20, move: 20},
        harvesterRoom: {work: 6, carry: 4, move: 6},
        repairer: {work: 6, carry: 6, move: 6},
        repairerWall: {work: 5, carry: 10, move: 10},
        upgrader: {work: 30, carry: 6, move: 8},
        builder: {work: 8, carry: 8, move: 8},
        outputer: {carry: 15, move: 15},
        king: {carry: 10, move: 10},
        queen: {carry: 10, move: 10},
        harvesterMineral: {work: 5, carry: 6, move: 6},
        soldier: {tough: 9, attack: 16, move: 25},
        docter: {tough: 9, heal: 16, move: 25},
        creepLab: {carry: 10, move: 10},
        test: {attack: 1, heal: 1, move: 2},
        creepTransfer: {carry: 4, move: 4},
        reserver: {claim: 2, move: 2},
    },
    8: {
        harvester: {work: 10, carry: 1, move: 5}, 
        transfer: {carry: 12, move: 12},
        transferRoom: {carry: 20, move: 20},
        repairer: {work: 6, carry: 6, move: 6},
        repairerWall: {work: 5, carry: 10, move: 10},
        upgrader: {work: 1, carry: 1, move: 1},
        builder: {work: 15, carry: 20, move: 15},
        outputer: {carry: 10, move: 10},
        king: {carry: 10, move: 10},
        queen: {carry: 20, move: 20},
        harvesterMineral: {work: 5, carry: 6, move: 6},
        soldier: {tough: 9, attack: 16, move: 25},
        docter: {tough: 9, heal: 16, move: 25},
        creepLab: {carry: 10, move: 10},
        test: {attack: 1, heal: 1, move: 2},
        creepTransfer: {carry: 4, move: 4},
        creepPS: {carry: 10, move: 10},
        harvesterRoom: {work: 6, carry: 4, move: 6},
        reserver: {claim: 2, move: 2},
        manager: {carry: 1, move: 1},

        powerHarvester: {work: 10, carry: 1, move: 1},
    }
}

export const CREEP_STATE = {
    PREPARE: 'creepPrepare',
    TARGET: 'creepTarget',
    BACK: 'creepBack',
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
    FILL_NUKE: 'fillNuke',
    FILL_EXTENSION: 'fillExtension',
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

export const PC_TASK = {
    REGEN_SOURCE : 'regenSource',
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
    { target: RESOURCE_UTRIUM_HYDRIDE, number: 1000},

    // ranged attack
    { target: RESOURCE_CATALYZED_KEANIUM_ALKALIDE, number: 6000},
    { target: RESOURCE_KEANIUM_ALKALIDE, number: 3000}, 
    { target: RESOURCE_KEANIUM_OXIDE, number: 1000},

    // move
    { target: RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE, number: 6000}, 
    { target: RESOURCE_ZYNTHIUM_ALKALIDE, number: 1000}, 
    { target: RESOURCE_ZYNTHIUM_OXIDE, number: 1000},

    // tough
    { target: RESOURCE_CATALYZED_GHODIUM_ALKALIDE, number: 6000}, 
    { target: RESOURCE_GHODIUM_ALKALIDE, number: 2000}, 
    { target: RESOURCE_GHODIUM_OXIDE, number: 1000},

    // heal
    { target: RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE, number: 6000},
    { target: RESOURCE_LEMERGIUM_ALKALIDE, number: 2000}, 
    { target: RESOURCE_LEMERGIUM_OXIDE, number: 1000},

    // dismantle
    { target: RESOURCE_CATALYZED_ZYNTHIUM_ACID, number: 4000},
    { target: RESOURCE_ZYNTHIUM_ACID, number: 1000}, 
    { target: RESOURCE_ZYNTHIUM_HYDRIDE, number: 1000},

    // upgrader
    { target: RESOURCE_CATALYZED_GHODIUM_ACID, number: 4000},   
    { target: RESOURCE_GHODIUM_ACID, number: 1000}, 
    { target: RESOURCE_GHODIUM_HYDRIDE, number: 1000},

    // { target: RESOURCE_CATALYZED_UTRIUM_ALKALIDE, number: 3000},    // harvester
    // { target: RESOURCE_CATALYZED_KEANIUM_ACID, number: 3000},       // carry
    // { target: RESOURCE_CATALYZED_LEMERGIUM_ACID, number: 3000},     // repairer

    // // 二级化合物
    // { target: RESOURCE_UTRIUM_ALKALIDE, number: 3000}, 
    // { target: RESOURCE_KEANIUM_ACID, number: 3000}, 
    // { target: RESOURCE_LEMERGIUM_ACID, number: 3000}, 

    // // 一级化合物
    // { target: RESOURCE_UTRIUM_OXIDE, number: 3000},
    // { target: RESOURCE_KEANIUM_HYDRIDE, number: 3000},
    // { target: RESOURCE_LEMERGIUM_HYDRIDE, number: 3000},
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