export enum Priority {
    Now         = 0,
    High        = 1,
    NormalHigh  = 2,
    Normal      = 3,
    NormalLow   = 4,
    Low         = 5,
}

export const ReactionTable: IReactionTable = {
    ["XUH2O"]: ["UH2O", "X"],
    ["XUHO2"]: ["UHO2", "X"],
    ["XKH2O"]: ["KH2O", "X"],
    ["XKHO2"]: ["KHO2", "X"],
    ["XLH2O"]: ["LH2O", "X"],
    ["XLHO2"]: ["LHO2", "X"],
    ["XZH2O"]: ["ZH2O", "X"],
    ["XZHO2"]: ["ZHO2", "X"],
    ["XGH2O"]: ["GH2O", "X"],
    ["XGHO2"]: ["GHO2", "X"],

    ["UH2O"]: ["UH", "OH"],
    ["UHO2"]: ["UO", "OH"],
    ["KH2O"]: ["KH", "OH"],
    ["KHO2"]: ["KO", "OH"],
    ["LH2O"]: ["LH", "OH"],
    ["LHO2"]: ["LO", "OH"],
    ["ZH2O"]: ["ZH", "OH"],
    ["ZHO2"]: ["ZO", "OH"],
    ["GH2O"]: ["GH", "OH"],
    ["GHO2"]: ["GO", "OH"],

    ["UH"]: ["U", "H"],
    ["UO"]: ["U", "O"],
    ["KH"]: ["K", "H"],
    ["KO"]: ["K", "O"],
    ["LH"]: ["L", "H"],
    ["LO"]: ["L", "O"],
    ["ZH"]: ["Z", "H"],
    ["ZO"]: ["Z", "O"],
    ["GH"]: ["G", "H"],
    ["GO"]: ["G", "O"],

    ["OH"]: ["O", "H"],
    ["ZK"]: ["Z", "K"],
    ["UL"]: ["U", "L"],
    ["G"]: ["ZK", "UL"],
}

export const ReactionTarget = [
    // attack
    { target: "UH", amount: 5000},
    { target: "UH2O", amount: 5000},
    { target: "XUH2O", amount: 10000},

    // harvest
    { target: "UO", amount: 5000},
    { target: "UHO2", amount: 5000},
    { target: "XUHO2", amount: 10000},

    // carry
    { target: "KH", amount: 5000},
    { target: "KH2O", amount: 5000},
    { target: "XKH2O", amount: 10000},
    
    // ranged
    { target: "KO", amount: 5000},
    { target: "KHO2", amount: 5000},
    { target: "XKHO2", amount: 10000},

    // build
    { target: "LH", amount: 5000},
    { target: "LH2O", amount: 5000},
    { target: "XLH2O", amount: 10000},
    
    // heal
    { target: "LO", amount: 5000},
    { target: "LHO2", amount: 5000},
    { target: "XLHO2", amount: 10000},

    // dismantle
    { target: "ZH", amount: 5000},
    { target: "ZH2O", amount: 5000},
    { target: "XZH2O", amount: 10000},

    // move 
    { target: "ZO", amount: 5000},
    { target: "ZHO2", amount: 5000},
    { target: "XZHO2", amount: 10000},

    // upgrade
    { target: "GH", amount: 5000},
    { target: "GH2O", amount: 5000},
    { target: "XGH2O", amount: 10000},
    
    // tough
    { target: "GO", amount: 5000},
    { target: "GHO2", amount: 5000},
    { target: "XGHO2", amount: 10000},

    // 基础化合物
    { target: "OH", amount: 10000},
    { target: "ZK", amount: 5000},
    { target: "UL", amount: 5000},
    { target: "G", amount: 5000},
] as { target: ResourceConstant, amount: number}[];

export const OPERATOR_POWER_COST = {
    [PWR_GENERATE_OPS]:         { resourceType: 'ops', amount: 0},
    [PWR_OPERATE_SPAWN]:        { resourceType: 'ops', amount: 100},
    [PWR_OPERATE_TOWER]:        { resourceType: 'ops', amount: 10},
    [PWR_OPERATE_STORAGE]:      { resourceType: 'ops', amount: 100},
    [PWR_OPERATE_LAB]:          { resourceType: 'ops', amount: 10},
    [PWR_OPERATE_EXTENSION]:    { resourceType: 'ops', amount: 2},
    [PWR_OPERATE_OBSERVER]:     { resourceType: 'ops', amount: 10},
    [PWR_OPERATE_TERMINAL]:     { resourceType: 'ops', amount: 100},
    [PWR_DISRUPT_SPAWN]:        { resourceType: 'ops', amount: 10},
    [PWR_DISRUPT_TOWER]:        { resourceType: 'ops', amount: 10},
    [PWR_DISRUPT_SOURCE]:       { resourceType: 'ops', amount: 100},
    [PWR_SHIELD]:               { resourceType: 'energy', amount: 100},
    [PWR_REGEN_SOURCE]:         { resourceType: 'ops', amount: 0},
    [PWR_REGEN_MINERAL]:        { resourceType: 'ops', amount: 0},
    [PWR_DISRUPT_TERMINAL]:     { resourceType: 'ops', amount: 50},     // 1 级 的时候
    [PWR_OPERATE_POWER]:        { resourceType: 'ops', amount: 200},
    [PWR_FORTIFY]:              { resourceType: 'ops', amount: 5},
    [PWR_OPERATE_CONTROLLER]:   { resourceType: 'ops', amount: 200},
    [PWR_OPERATE_FACTORY]:      { resourceType: 'ops', amount: 100},
} as { [power: number]: { resourceType: ResourceConstant, amount: number} };