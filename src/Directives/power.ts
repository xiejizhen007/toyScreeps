import { Setups } from "Creeps/setups";
import { Mem } from "Mem";
import { RoomNetwork } from "Network/RoomNetwork";
import { Directive } from "./Directive";

export interface DirectivePowerMemory extends FlagMemory {
    power: PowerBankInfo;
    call: boolean;      // 是否已经呼叫了 transfer
    num: number;        // 已经呼叫的 pb 小队数量
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
        this.memory.num = Mem.wrap(flag.memory, 'num', 0);
    }

    init(): void {
        this.spwanRoleToWork();
    }

    work(): void {
        
    }

    finish(): void {
        if (Game.time > this.memory.power.decay + this.memory.power.tick || (Game.rooms[this.pos.roomName] && this.pos.lookFor(LOOK_STRUCTURES).length == 0)) {
            this.remove();
            console.log('删除 flag: ' + this.name);
        }
    }

    private spwanRoleToWork() {
        const pb_attack = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == 'pb_attack');
        const pb_heal = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == 'pb_heal');
        const pb_transfer = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == 'pb_transfer');

        // 当前能打出的最高伤害
        // let maxHits = this.memory.power.tick * 500;

        // 总共需要的小队数量
        // const team_num = Math.ceil(2000000 / maxHits);
        // console.log(team_num);

        // console.log(pb_attack.length);

        if (pb_attack.length < this.memory.power.freeLocation) {
            let num = 0;
            _.forEach(pb_attack, f => {
                const creep = Game.creeps[f];
                // 确保一次孵化一小队
                if (creep && creep.spawning) {
                    num++;
                }
            });

            console.log('num: ' + num);
            if (num == 0 && Game.time % 3 == 0) {
                this.roomNetwork.spawnNetwork.registerCreep({
                    setup: Setups.pb.pb_attack.default,
                    priority: 10,
                    opts: {
                        flag: this.flag.name
                    }
                });

                this.memory.num++;
            }
        }

        if (pb_heal.length < pb_attack.length && Game.time % 3 == 0) {
            console.log('need a pb_heal');
            this.roomNetwork.spawnNetwork.registerCreep({
                setup: Setups.pb.pb_heal.default,
                priority: 10,
                opts: {
                    flag: this.flag.name
                }
            });
        }

        if (Game.rooms[this.pos.roomName]) {
            const pb = this.pos.lookFor(LOOK_STRUCTURES)[0] as StructurePowerBank;
            if (pb && pb.hits <= 600000) {
                const wish = Math.ceil(this.memory.power.amount / 1600);
                if (pb_transfer.length < wish && Game.time % 3 == 0) {
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
}