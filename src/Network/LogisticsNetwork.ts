import { Mem } from "Mem";
import { RoomNetwork } from "./RoomNetwork";

export type LogisticsNetworkTarget = 
    | StructureStorage
    | StructureTerminal
    | StructureContainer
    | StructureLink
    | StructureLab
    | Resource
    | Ruin
    | Tombstone

export interface LogisticsNetworkRequest {
    id: string;
    target: string;                         // target id
    amount: number;                         // 负数代表输出，正数代表输入
    resourceType: ResourceConstant | 'all';
}

export interface LogisticsNetworkMemory {
    queue: {
        request: LogisticsNetworkRequest;
        creep: string | undefined;
    }[];
}

export const LogisticsNetworkMemoryDefaults: LogisticsNetworkMemory = {
    queue: [],
};

export interface RequestOptions {
    amount?: number;
    resourceType?: ResourceConstant | 'all';
}

export class LogisticsNetwork {
    memory: LogisticsNetworkMemory;
    requests: LogisticsNetworkRequest[];

    roomNetwork: RoomNetwork;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;
        this.memory = Mem.wrap(roomNetwork.memory, 'logisticsNetwork', LogisticsNetworkMemoryDefaults);
        this.requests = [];
    }

    requestInput(target: LogisticsNetworkTarget, opts = {} as RequestOptions) {
        _.defaults(opts, {
            resourceType: RESOURCE_ENERGY,
        });

        if (!opts.amount) {
            opts.amount = this.getInputAmount(target, opts.resourceType as ResourceConstant);
        }

        const requestId = this.requests.length;
        const req: LogisticsNetworkRequest = {
            id: requestId.toString(),
            target: target.id,
            amount: opts.amount,
            resourceType: opts.resourceType,
        };

        this.requests.push(req);
    }

    requestOutput(target: LogisticsNetworkTarget, opts = {} as RequestOptions) {
        _.defaults(opts, {
            resourceType: RESOURCE_ENERGY,
        });

        if (!opts.amount) {
            opts.amount = this.getOutputAmount(target, opts.resourceType);
        }

        opts.amount = -opts.amount;
        const requestId = this.requests.length;
        const req: LogisticsNetworkRequest = {
            id: requestId.toString(),
            target: target.id,
            amount: opts.amount,
            resourceType: opts.resourceType
        };

        this.requests.push(req);
    }

    private getInputAmount(target: LogisticsNetworkTarget, resourceType: ResourceConstant) {
        if (target instanceof Resource || target instanceof Tombstone || target instanceof Ruin) {
            console.log('resource, ruin, tombstone can\'t request input');
            return 0;
        } else if (target instanceof StructureStorage || target instanceof StructureTerminal 
            || target instanceof StructureContainer || target instanceof StructureFactory) {
            return target.store.getFreeCapacity();
        } else if (target instanceof StructureSpawn || target instanceof StructureExtension
            || target instanceof StructureTower || target instanceof StructureLink) {
            return target.store.getFreeCapacity(RESOURCE_ENERGY);
        } else {
            if (target instanceof StructureLab) {
                if (resourceType == RESOURCE_ENERGY) {
                    return target.store.getFreeCapacity(RESOURCE_ENERGY);
                } else if (!target.mineralType || resourceType == target.mineralType) {
                    return target.store.getFreeCapacity(resourceType);
                }
            }
        }
    }

    private getOutputAmount(target: LogisticsNetworkTarget, resourceType: ResourceConstant | 'all') {
        if (resourceType == 'all') {
            if (target instanceof Resource) {
                return target.amount;
            } else if (target instanceof Tombstone) {
                return target.store.getUsedCapacity();
            } else if (target instanceof Ruin) {
                return target.store.getUsedCapacity();
            }
        }
    }
}