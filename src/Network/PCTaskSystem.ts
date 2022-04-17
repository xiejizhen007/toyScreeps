import { Mem } from "Mem";
import { RoomNetwork } from "./RoomNetwork";

export type PCTaskType = {
    type: PowerConstant;
    target?: string;        // object id
}

export interface PCTaskSystemMemory {
    requests: PCTaskType[];
    pcName: string;         // 常驻 powerCreep 的名字
    powerEnabled: boolean;
}

export const PCTaskSystemMemoryDefault: PCTaskSystemMemory = {
    requests: [],
    pcName: "",
    powerEnabled: false,
};

export class PCTaskSystem {
    requests: PCTaskType[];
    roomNetwork: RoomNetwork;
    room: Room;
    memory: PCTaskSystemMemory;
    pc: PowerCreep;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.requests = [];
        this.room = roomNetwork.room;
        this.memory = Mem.wrap(roomNetwork.memory, 'pcTaskSystem', PCTaskSystemMemoryDefault);
    }

    init(): void {
        this.requests = this.memory.requests;
        this.pc = Game.powerCreeps[this.memory.pcName];
    }

    work(): void {
        if (!this.pc) {
            // 没有这个 pc
            return;
        }

        if (!this.pc.ticksToLive) {
            // 当前的 pc 还没复活，尝试将其复活在当前房间当中
            if (!this.pc.spawnCooldownTime) {
                this.pc.spawn(this.roomNetwork.powerSpawn);
            }

            return;
        }

        if (!this.roomNetwork.room.controller.isPowerEnabled) {
            console.log("房间: " + this.roomNetwork.room.name + "未启用 power");
            return;
        } else {
            this.memory.powerEnabled = true;
        }

        if (this.pc.powers[PWR_REGEN_SOURCE] && this.pc.powers[PWR_REGEN_SOURCE].cooldown == 0) {
            const source = this.room.find(FIND_SOURCES).find(f => !f.effects.find(e => e.effect == PWR_REGEN_SOURCE));
            if (source && !this.requests.find(f => f.target == source.id)) {
                this.requests.push({
                    type: PWR_REGEN_SOURCE,
                    target: source.id
                });
            }
        }

        if (this.pc.powers[PWR_OPERATE_POWER] && this.pc.powers[PWR_OPERATE_POWER].cooldown == 0) {
            const spawn = this.roomNetwork.powerSpawn;
            if (spawn && !this.requests.find(f => f.target == spawn.id)) {
                this.requests.push({
                    type: PWR_OPERATE_POWER,
                    target: spawn.id,
                });
            }
        }

        if (this.canUsePower(PWR_OPERATE_EXTENSION)) {
            const room = this.roomNetwork.room;
            if (room.energyAvailable != room.energyCapacityAvailable) {
                this.requests.push({
                    type: PWR_OPERATE_EXTENSION,
                    target: this.roomNetwork.terminal.id,
                });
            }
        }
    }

    finish(): void {
        this.memory.requests = this.requests;
    }

    public setPC(name: string) {
        this.memory.pcName = name;
    }

    private canUsePower(power: PowerConstant) {
        if (this.pc.powers[power] && this.pc.powers[power].cooldown == 0) {
            return true;
        }

        return false;
    }
}