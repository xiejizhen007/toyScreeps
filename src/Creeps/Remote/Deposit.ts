import { RoleWork } from "Creeps/RoleWork";
import { DirectiveDeposit } from "Directives/deposit";

export interface Role_depositMemory extends CreepMemory {
    deposit: DepositInfo;
    finish?: boolean;
    useTime?: number;
}

export class Role_work_deposit extends RoleWork {
    flag: DirectiveDeposit;
    memory: Role_depositMemory;

    constructor(creep: Creep) {
        super(creep);
        this.flag = Kernel.directives[creep.memory.flag];
    }

    init(): void {
        if (!this.memory.useTime) {
            this.memory.useTime = Game.time;
        }
    }

    work(): void {

    }

    finish(): void {

    }
}