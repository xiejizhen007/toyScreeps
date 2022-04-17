import { Setups } from "Creeps/setups";
import { Mem } from "Mem";
import { Directive } from "./Directive";

export interface DirectiveDepositMemory extends FlagMemory {
    deposit: DepositInfo;
}

export class DirectiveDeposit extends Directive {
    
    static directiveName = "deposit";
    static color = COLOR_RED;
	static secondaryColor = COLOR_YELLOW;

    memory: DirectiveDepositMemory;

    constructor(flag: Flag) {
        super(flag);
        this.memory.deposit = Mem.wrap(flag.memory, 'deposit',
            Memory.rooms[flag.pos.roomName].deposits.find(f => f.pos.x == flag.pos.x && f.pos.y == flag.pos.y));
    }

    init(): void {
        this.spwanRoleToWork();
    }

    work(): void {
        
    }

    finish(): void {

    }

    private spwanRoleToWork() {

    }
}
