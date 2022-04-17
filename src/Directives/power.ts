import { Setups } from "Creeps/setups";
import { Mem } from "Mem";
import { RoomNetwork } from "Network/RoomNetwork";
import { Directive } from "./Directive";

export interface DirectivePowerMemory extends FlagMemory {
    power: PowerBankInfo;
    call: boolean;      // 是否已经呼叫了 transfer
}

export class DirectivePower extends Directive {
    
    static directiveName = "power";
    static color = COLOR_RED;
	static secondaryColor = COLOR_YELLOW;

    memory: DirectivePowerMemory;

    constructor(flag: Flag) {
        super(flag);
        this.memory.power = Mem.wrap(flag.memory, 'power',
            Memory.rooms[flag.pos.roomName].powers.find(f => f.pos.x == flag.pos.x && f.pos.y == flag.pos.y));
    }

    init(): void {
        this.spwanRoleToWork();
    }

    work(): void {
        
    }

    finish(): void {
        if (Game.time > this.memory.power.decay + this.memory.power.tick) {
            this.remove();
            console.log('删除 flag: ' + this.name);
        }
    }

    private spwanRoleToWork() {
        const pb_attack = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == 'pb_attack');
        const pb_heal = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == 'pb_heal');
        const pb_transfer = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == 'pb_transfer');

        if (pb_attack.length == 0) {
            console.log('need a pb_attack');
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.pb.pb_attack.default,
                priority: 10,
                opts: {
                    flag: this.flag.name
                }
            });
        }

        if (pb_heal.length == 0) {
            console.log('need a pb_heal');
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.pb.pb_heal.default,
                priority: 10,
                opts: {
                    flag: this.flag.name
                }
            });
        }

        const pb = this.pos.lookFor(LOOK_STRUCTURES)[0] as StructurePowerBank;
        if (pb && pb.hits <= 600000) {
            const wish = this.memory.power.amount / 1600;
            if (pb_transfer.length < wish) {
                console.log('need a pb_transfer');
                this.roomNetwork.spawnNetwork.registerCreep({
                    setup: Setups.pb.pb_transfer.default,
                    priority: 10,
                    opts: {
                        flag: this.flag.name
                    }
                });
            }
        }
    }
}