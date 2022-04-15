import { Priority } from "setting";
import { RoomNetwork } from "./RoomNetwork";
import { TransportNetwork } from "./TransportNetwork";

export interface CommandCenterMemory {

}

export const CommandCenterMemoryDefaults: CommandCenterMemory = {
    
}

export class CommandCenter {
    roomNetwork: RoomNetwork;

    storage?: StructureStorage;
    terminal?: StructureTerminal;
    factory?: StructureFactory;
    spawn?: StructureSpawn;
    link?: StructureLink;
    nuker?: StructureNuker;
    observer?: StructureObserver;
    powerSpawn?: StructurePowerSpawn;
    pos: RoomPosition;

    transportNetwork: TransportNetwork;

    constructor(roomNetwork: RoomNetwork, storage: StructureStorage) {
        this.roomNetwork = roomNetwork;

        this.storage = storage;
        this.pos = new RoomPosition(storage.pos.x + 1, storage.pos.y, storage.pos.roomName);
        this.terminal = roomNetwork.room.terminal;
        // this.factory = _.find(this.roomNetwork.room.structures, f => f.structureType == STRUCTURE_FACTORY) as StructureFactory;
        this.factory = roomNetwork.room.factory;
        // this.powerSpawn = 
        this.powerSpawn = _.find(this.roomNetwork.room.structures, f => f.structureType == STRUCTURE_POWER_SPAWN) as StructurePowerSpawn;
        
        this.spawn = storage.pos.findClosestByLimitedRange(this.roomNetwork.spawns, 2);
        this.link = storage.pos.findClosestByLimitedRange(this.roomNetwork.links, 2);

        this.transportNetwork = new TransportNetwork;
    }

    init(): void {
        this.registerLinkRequests();
        this.registerRequests();
    }

    work(): void {
        
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