import { Directive } from "Directives/Directive";
import { Mem } from "Mem";
import { freeLocationIn } from "modules/tools";
import { isHighWay } from "types";

export interface ObserverMemory {
    powers: PowerBankInfo[];
    deposits: DepositInfo[];

    observerRoom: {
        tick: number;
        room: string;
        base: string;
    }[],
}

export const ObserverMemoryDefaults: ObserverMemory = {
    powers: [],
    deposits: [],
    observerRoom: [],
}

export class Observer implements IObserver {
    private directives: Directive[];
    memory: ObserverMemory;

    powers: PowerBankInfo[];
    deposits: DepositInfo[];

    observerRoom: {
        tick: number;
        room: string;
        base: string;
    }[];

    constructor() {
        this.directives = [];
        this.powers = [];
        this.deposits = [];
        this.observerRoom = [];
        this.memory = Mem.wrap(Memory, "observer", ObserverMemoryDefaults);
    }

    refresh(): void {
        
    }

    init(): void {
        this.powers = this.memory.powers;
        this.deposits = this.memory.deposits;
        this.observerRoom = this.memory.observerRoom;

        // 把丢失视野的删掉
        _.remove(this.observerRoom, f => f.tick + 1 < Game.time);
        // 超时
        _.remove(this.powers, f => f.tick + 100 < Game.time);
        _.remove(this.deposits, f => f.tick + 100 < Game.time);
        _.forEach(this.directives, f => f.init());
    }

    work(): void {
        _.forEach(this.directives, f => f.work());
    }

    finish(): void {
        _.forEach(this.directives, f => f.finish());        
        // 更新房间信息
        _.forEach(this.observerRoom, f => this.updateRoomState(f.room));

        this.memory.powers = this.powers;
        this.memory.deposits = this.deposits;
        this.memory.observerRoom = this.observerRoom;
    }

    updateRoomState(roomName: string) {
        const room = Game.rooms[roomName];
        if (!room) {
            return;
        }

        // console.log('update room ' + roomName + ' state');
        room.memory.tick = Game.time;

        if (isHighWay(roomName)) {
            console.log(roomName + ' is high way');
            const banks = room.structures.filter(f => f.structureType == STRUCTURE_POWER_BANK) as StructurePowerBank[];
            // console.log('banks? ' + banks.length);
            room.memory.powers = [];
            room.memory.deposits = [];
            if (banks.length) {
                banks.forEach(f => {
                    if (this.powers.find(p => p.id == f.id)) {
                        return;
                    }

                    const freeLocation = freeLocationIn(f.pos);
                    
                    room.memory.powers.push({
                        id: f.id,
                        amount: f.power,
                        pos: f.pos,
                        decay: f.ticksToDecay,
                        hits: f.hits,
                        tick: Game.time,
                        freeLocation: freeLocation,
                    });

                    this.powers.push({
                        id: f.id,
                        amount: f.power,
                        pos: f.pos,
                        decay: f.ticksToDecay,
                        hits: f.hits,
                        tick: Game.time,
                        freeLocation: freeLocation,
                    });
                });
            }

            const deposits = room.find(FIND_DEPOSITS);
            if (deposits.length) {
                deposits.forEach(f => {
                    if (this.deposits.find(p => p.id == f.id)) {
                        return;
                    }

                    this.deposits.push({
                        id: f.id,
                        cooldown: f.lastCooldown,
                        decay: f.ticksToDecay,
                        depositType: f.depositType,
                        pos: f.pos,
                        tick: Game.time,
                    });
                });
            }
        } else {

        }
    }

    registerDirective(directive: Directive): void {
        this.directives.push(directive);
    }

    removeDirective(directive: Directive): void {
        _.remove(this.directives, r => r.name == directive.name);
    }

    registerObserver(base: string, room: string): void {
        if (!_.find(this.observerRoom, f => f.room == room)) {
            this.observerRoom.push({
                tick: Game.time,
                room: room,
                base: base,
            });
        }
    }
}