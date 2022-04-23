// 处理房间事务的基本单位

export class Role {
    creep: Creep;
    role: string;

    constructor(creep: Creep) {
        this.creep = creep;
    }
}