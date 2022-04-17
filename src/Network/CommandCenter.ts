import { DirectivePower } from "Directives/power"
import { Mem } from "Mem";
import { decodePosMemory } from "modules/tools";
import { Priority } from "setting";
import { RoomNetwork } from "./RoomNetwork";
import { TransportNetwork } from "./TransportNetwork";

export interface CommandCenterMemory {
    tick?: number;           // 下发命令时的 tick
    checkRoom?: string;      // 需要 ob 的房间
}

export const CommandCenterMemoryDefaults: CommandCenterMemory = {
    
}

export class CommandCenter {
    roomNetwork: RoomNetwork;
    memory: CommandCenterMemory;

    storage?: StructureStorage;
    terminal?: StructureTerminal;
    factory?: StructureFactory;
    spawn?: StructureSpawn;
    link?: StructureLink;
    nuker?: StructureNuker;
    observer?: StructureObserver;
    powerSpawn?: StructurePowerSpawn;
    pos: RoomPosition;
    checkRoom?: string;             // 需要检查视野的房间

    transportNetwork: TransportNetwork;

    constructor(roomNetwork: RoomNetwork, storage: StructureStorage) {
        this.roomNetwork = roomNetwork;
        this.memory = Mem.wrap(roomNetwork.memory, 'commandCenter', CommandCenterMemoryDefaults);

        this.storage = storage;
        this.pos = new RoomPosition(storage.pos.x + 1, storage.pos.y, storage.pos.roomName);
        this.terminal = roomNetwork.room.terminal;
        this.factory = roomNetwork.room.factory;
        this.powerSpawn = _.find(this.roomNetwork.room.structures, f => f.structureType == STRUCTURE_POWER_SPAWN) as StructurePowerSpawn;
        this.observer = _.find(this.roomNetwork.room.structures, f => f.structureType == STRUCTURE_OBSERVER) as StructureObserver;
        
        this.spawn = storage.pos.findClosestByLimitedRange(this.roomNetwork.spawns, 2);
        this.link = storage.pos.findClosestByLimitedRange(this.roomNetwork.links, 2);
        this.checkRoom = undefined;

        this.transportNetwork = new TransportNetwork;
    }

    init(): void {
        this.registerLinkRequests();
        this.registerRequests();

        this.registerPowerBank();
    }

    work(): void {

    }

    registerObserver(room: string) {
        // console.log('need to ob: ' + room);
        this.checkRoom = room;
        this.memory.checkRoom = room;
        this.memory.tick = Game.time;
        Kernel.observer.registerObserver(this.roomNetwork.name, this.checkRoom);
        this.observer.observeRoom(this.checkRoom);

        // if (this.observer) {
        //     if (this.checkRoom) {
        //         Kernel.observer.registerObserver(this.checkRoom);
        //         this.observer.observeRoom(this.checkRoom);
        //     }
        // }
    }

    private registerPowerBank() {
        if (Game.time == this.memory.tick + 1) {
            const room = Game.rooms[this.memory.checkRoom];
            if (room && room.memory.powers) {
                room.memory.powers.forEach(f => {
                    const pos = decodePosMemory(f.pos);
                    DirectivePower.createByRoom(pos, this.roomNetwork.name);
                });
            }
        }
    }

    private registerLinkRequests(): void {
        if (this.link) {
            if (this.link.store[RESOURCE_ENERGY] > 700) {
                this.roomNetwork.linkNetwork.registerSend(this.link);
            }
        }
    }

    private registerRequests(): void {
        if (this.link && this.link.store[RESOURCE_ENERGY] < 0.9 * this.link.store.getCapacity(RESOURCE_ENERGY) && this.link.cooldown <= 1) {
            if (this.roomNetwork.linkNetwork.receiveLinks.length > 0) {
                this.transportNetwork.requestInput(this.link, Priority.High);
            }
        }

        if (this.link && this.link.store[RESOURCE_ENERGY] > 0) {
            if (this.roomNetwork.linkNetwork.receiveLinks.length == 0) {
                this.transportNetwork.requestOutput(this.link, Priority.NormalHigh);
            }
        }

        if (this.powerSpawn && this.storage && this.terminal && this.powerSpawn.pos.isNearTo(this.pos)) {

            let needEnergyAmount = 50;
            let needPowerAmount = 1;

            if (this.powerSpawn.effects && this.powerSpawn.effects.find(f => f.effect == PWR_OPERATE_POWER)) {
                const effect = this.powerSpawn.effects.find(f => f.effect == PWR_OPERATE_POWER) as any;
                needPowerAmount += effect.level;
                needEnergyAmount *= needPowerAmount;
            }

            // run powerSpawn
            if (this.powerSpawn.store['energy'] >= needEnergyAmount && this.powerSpawn.store['power'] >= needPowerAmount) {
                this.powerSpawn.processPower();
            }


            const centerAmount = this.storage.store['energy'] + this.terminal.store['energy'];
            const powerAmount = this.storage.store['power'] + this.terminal.store['power'];
            if (centerAmount >= 100000) {
                if (this.powerSpawn.store['energy'] <= needEnergyAmount + 50) {
                    this.transportNetwork.requestInput(this.powerSpawn, Priority.NormalLow, {
                        resourceType: 'energy',
                        amount: this.powerSpawn.store.getFreeCapacity('energy')
                    });
                } else if (this.powerSpawn.store['power'] <= needPowerAmount + 1) {
                    if (powerAmount <= 100) {
                        Kernel.market.buy(this.roomNetwork.name, 'power', 3000);
                    }

                    this.transportNetwork.requestInput(this.powerSpawn, Priority.NormalLow, {
                        resourceType: 'power',
                        amount: Math.min(this.powerSpawn.store.getFreeCapacity('power'), powerAmount),
                    });
                }
            } else {
                Kernel.market.buy(this.roomNetwork.name, 'energy', Math.min(this.terminal.store.getFreeCapacity(), 50000), false);
            }
        }
    }
}