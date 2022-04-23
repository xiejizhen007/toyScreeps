// 通过旗子管理房间内总体的工作，如 harvest，upgrade 等

export class Flags {
    flag: Flag;

    constructor(flag: Flag) {
        this.flag = flag;
    }
}