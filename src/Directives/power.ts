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
        if (Game.rooms[this.pos.roomName]) {
            const bank = this.pos.lookFor(LOOK_STRUCTURES)[0];
            const ruin = this.pos.lookFor(LOOK_RUINS)[0];
            const resource = this.pos.lookFor(LOOK_RESOURCES)[0];

            if (!bank && !resource && !ruin) {
                this.remove();
                return;
            }
        }


        
        if (Game.time > this.memory.power.decay + this.memory.power.tick) {
            this.remove();
            console.log('删除 flag: ' + this.name);
        }
    }

    private spwanRoleToWork() {
        const pb_attack = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == 'pb_attack');
        const pb_heal = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == 'pb_heal');
        const pb_transfer = _.filter(this.roomNetwork.memory.myCreeps, f => Game.creeps[f] && Game.creeps[f].memory.role == 'pb_transfer');

        // 一个攻击 creep 一直攻击 pb，直到 pb 消失造成的最大生命值
        let maxHits = this.memory.power.decay * 500;
        // 一个攻击 creep 一生最大造成的血量，200t 用来走路
        let oneMaxHits = 1300 * 500;

        // 总共需要的小队数量
        let team_num = Math.ceil(this.memory.power.hits / oneMaxHits);
        console.log('team_num: ' + team_num);

        // 当前还有空余位置，并且没超过需要的小队上限时
        if (pb_attack.length < this.memory.power.freeLocation && this.memory.num < team_num) {
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

        if (pb_heal.length < pb_attack.length && Game.time % 3 == 1) {
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
            if (pb && pb.hits <= 400000) {
                // 避免最后一个拿的太少
                const wish = Math.ceil(this.memory.power.amount / 1800);
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