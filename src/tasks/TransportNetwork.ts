/**
 * 房间内的资源传输网络
 */

export class TransportNetwork {
    transfer: TransportNetworkRequests[];
    withdraw: TransportNetworkRequests[];

    constructor() {
        this.refrash();
    }

    refrash(): void {
        this.transfer = [];
        this.withdraw = [];
    }

    requestInput(target: TransportNetworkTarget, options = {} as TransportNetworkOptions): void {
        _.defaults(options, {
            resourceType: RESOURCE_ENERGY,
        });

        if (options.amount == undefined) {
            options.amount = this.getInputAmount(target, options.reosurceType);
        }

        const request = {
            target: target,
            amount: options.amount,
            reosurceType: options.reosurceType,
        } as TransportNetworkRequests;
        
        if (options.amount > 0) {
            this.transfer.push(request);
        }
    }

    requestOutput(target: TransportNetworkTarget, options = {} as TransportNetworkOptions): void {
        _.defaults(options, {
            resourceType: RESOURCE_ENERGY,
        });

        if (options.amount == undefined) {
            options.amount = this.getOutputAmount(target, options.reosurceType);
        }

        const request = {
            target: target,
            amount: options.amount,
            reosurceType: options.reosurceType,
        } as TransportNetworkRequests;
        
        if (options.amount > 0) {
            this.withdraw.push(request);
        }
    }

    private getInputAmount(target: TransportNetworkTarget, resourceType: ResourceConstant): number {
        if (target instanceof StructureSpawn || target instanceof StructureExtension
            || target instanceof StructureLink || target instanceof StructureContainer) {
            return target.store.getFreeCapacity();
        } else {
            if (target instanceof StructureLab) {
                if (resourceType == RESOURCE_ENERGY) {
                    return target.store.getFreeCapacity(RESOURCE_ENERGY);
                } else {
                    // 因为 target.mineralType 在 lab 没有矿物的时候为 undefined
                    return target.store.getFreeCapacity(resourceType);
                }
            } else if (target instanceof StructurePowerSpawn) {
                if (resourceType == RESOURCE_POWER) {
                    return target.store.getFreeCapacity(RESOURCE_POWER);
                } else if (resourceType == RESOURCE_ENERGY) {
                    return target.store.getFreeCapacity(RESOURCE_ENERGY);
                }
            } else if (target instanceof StructureNuker) {
                if (resourceType == "G") {
                    return target.store.getFreeCapacity("G");
                } else if (resourceType == RESOURCE_ENERGY) {
                    return target.store.getFreeCapacity(RESOURCE_ENERGY);
                }
            }
        }

        console.log('找不到对应的输入数量');
        return 0;
    }

    private getOutputAmount(target: TransportNetworkTarget, resourceType: ResourceConstant): number {
        if (target instanceof StructureLink && resourceType == RESOURCE_ENERGY) {
            return target.store[resourceType];
        } else if (target instanceof StructureLab) {
            if (target.mineralType == resourceType) {
                return target.store[resourceType];
            } else if (resourceType == RESOURCE_ENERGY) {
                return target.store[RESOURCE_ENERGY];
            }
        }

        console.log('找不到对应输出数量');
        return 0;
    }
}