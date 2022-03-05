export enum Priority {
    High        = 0,
    NormalHigh  = 1,
    Normal      = 2,
    NormalLow   = 3,
    Low         = 4,
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
    { target: "UH", amount: 3000},
    { target: "UH2O", amount: 3000},
    { target: "XUH2O", amount: 3000},

    // harvest
    { target: "UO", amount: 3000},
    { target: "UHO2", amount: 3000},
    { target: "XUHO2", amount: 3000},

    // carry
    { target: "KH", amount: 3000},
    { target: "KH2O", amount: 3000},
    { target: "XKH2O", amount: 3000},
    
    // ranged
    { target: "KO", amount: 3000},
    { target: "KHO2", amount: 3000},
    { target: "XKHO2", amount: 3000},

    // build
    { target: "LH", amount: 3000},
    { target: "LH2O", amount: 3000},
    { target: "XLH2O", amount: 3000},
    
    // heal
    { target: "LO", amount: 3000},
    { target: "LHO2", amount: 3000},
    { target: "XLHO2", amount: 3000},

    // dismantle
    { target: "ZH", amount: 3000},
    { target: "ZH2O", amount: 3000},
    { target: "XZH2O", amount: 3000},

    // move 
    { target: "ZO", amount: 3000},
    { target: "ZHO2", amount: 3000},
    { target: "XZHO2", amount: 3000},

    // upgrade
    { target: "GH", amount: 3000},
    { target: "GH2O", amount: 3000},
    { target: "XGH2O", amount: 3000},
    
    // tough
    { target: "GO", amount: 3000},
    { target: "GHO2", amount: 3000},
    { target: "XGHO2", amount: 3000},

    // 基础化合物
    { target: "OH", amount: 5000},
    { target: "ZK", amount: 3000},
    { target: "UL", amount: 3000},
    { target: "G", amount: 5000},
] as { target: ResourceConstant, amount: number}[];