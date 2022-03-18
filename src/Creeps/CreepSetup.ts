export interface CreepBodySetup {
    body: BodyPartConstant[];       // 基础的部件
    limit: number;                  // 总部件等于基础部件的 n 倍
    ordered?: boolean;              // 是否按顺序 [MOVE, MOVE, CARRY, CARRY] => [MOVE, CARRY, MOVE, CARRY]
    head?: BodyPartConstant[];      // 在基础部件上添加头部部件，如 tough
    tail?: BodyPartConstant[];      // 在基础部件上添加尾部部件，如 move, heal
}

export class CreepSetup {
    role: string;
    bodySetup: CreepBodySetup;
    
    constructor(role: string, bodySetup = {} as CreepBodySetup) {
        this.role = role;
        _.defaults(bodySetup, {
            body:   [],
            limit:  Infinity,
            orderd: true,
            head: [],
            tail: [],
        });
        this.bodySetup = bodySetup as CreepBodySetup;
    }

    generateBody(avaliableEnergy: number): BodyPartConstant[] {
        let body: BodyPartConstant[] = [];
        const oneCost = _.sum(this.bodySetup.body, part => BODYPART_COST[part]);
        const loop = _.min([Math.floor(avaliableEnergy / oneCost), this.bodySetup.limit, Math.floor(50 / this.bodySetup.body.length)]);

        if (this.bodySetup.ordered) {
            for (const part of this.bodySetup.body) {
                for (let i = 0; i < loop; i++) {
                    body.push(part);
                }
            }
        } else {
            for (let i = 0; i < loop; i++) {
                body = body.concat(this.bodySetup.body);
                // console.log(body);
            }
        }

        return body;
    }
}