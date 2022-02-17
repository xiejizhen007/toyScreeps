import { Priority } from "setting";

export interface TransportRequest {
    target: Structure;
    resourceType: ResourceConstant;
    amount: number;
    priority: number;
}

interface TransportRequestOptions {
    resourceType?: ResourceConstant;
    amount?: number;
}

export class TransportNetwork {
    input: TransportRequest[];
    output: TransportRequest[];

    constructor() {
        this.input = [];
        this.output = [];
    }

    get haveInputRequest(): boolean {
        return this.input.length > 0;
    }

    get haveOutputRequest(): boolean {
        return this.output.length > 0;
    }

    requestInput(target: Structure, priority = Priority.Normal, opts = {} as TransportRequestOptions) {
        // this.input.push(target);
        _.defaults(opts, {
            resourceType: RESOURCE_ENERGY
        });

        if (opts.amount == undefined) {
            opts.amount = this.getInputAmount(target, opts.resourceType);
        }

        const req: TransportRequest = {
            target: target,
            resourceType: opts.resourceType!,
            amount: opts.amount,
            priority: priority
        };

        if (req.amount > 0) {
            this.input.push(req);
        }
    }

    requestOutput(target: Structure, priority = Priority.Normal, opts = {} as TransportRequestOptions) {
        // this.output.push(target);
        _.defaults(opts, {
            resourceType: RESOURCE_ENERGY
        });

        if (opts.amount == undefined) {
            opts.amount = this.getOutputAmount(target, opts.resourceType);
        }

        const req: TransportRequest = {
            target: target,
            resourceType: opts.resourceType!,
            amount: opts.amount,
            priority: priority
        };

        if (req.amount > 0) {
            this.output.push(req);
        }
    }

    get findHighPriorityInputRequest(): TransportRequest | undefined {
        const minPriority = _.min(this.input, f => f.priority);
        const ret = _.find(this.input, f => f == minPriority);
        return ret;
    }
    
    get findHighPriorityOutputRequest(): TransportRequest | undefined {
        const minPriority = _.min(this.output, f => f.priority);
        const ret = _.find(this.output, f => f == minPriority);
        return ret;
    }

    private getInputAmount(target: Structure, resourceType: ResourceConstant): number {
        if (target instanceof StructureStorage || target instanceof StructureTerminal
            || target instanceof StructureFactory) {
            return target.store.getFreeCapacity();
        } else if (target instanceof StructureLink) {
            return target.store.getFreeCapacity(RESOURCE_ENERGY);
        } else if (target instanceof StructurePowerSpawn) {
            if (resourceType == RESOURCE_POWER) {
                return target.store.getFreeCapacity(RESOURCE_POWER);
            } else {
                return target.store.getFreeCapacity(RESOURCE_ENERGY);
            }
        } else if (target instanceof StructureNuker) {
            if (resourceType == RESOURCE_GHODIUM) {
                return target.store.getFreeCapacity(RESOURCE_GHODIUM);
            } else {
                return target.store.getFreeCapacity(RESOURCE_ENERGY);
            }
        } else if (target instanceof StructureLab) {
            if (resourceType == target.mineralType) {
                return target.store.getFreeCapacity(resourceType);
            } else if (resourceType == RESOURCE_ENERGY) {
                return target.store.getFreeCapacity(RESOURCE_ENERGY);
            }
        }

        console.log('err in get input amount');
        return 0;
    }

    private getOutputAmount(target: Structure, resourceType: ResourceConstant): number {
        if (target instanceof StructureStorage || target instanceof StructureTerminal
            || target instanceof StructureFactory) {
            return target.store[resourceType];
        } else if (target instanceof StructureLink) {
            return target.store[RESOURCE_ENERGY];
        } else if (target instanceof StructurePowerSpawn) {
            if (resourceType == RESOURCE_POWER) {
                return target.store[RESOURCE_POWER];
            } else {
                return target.store[RESOURCE_ENERGY];
            }
        } else if (target instanceof StructureLab) {
            if (resourceType == target.mineralType) {
                return target.store[target.mineralType];
            } else if (resourceType == RESOURCE_ENERGY) {
                return target.store[RESOURCE_ENERGY];
            }
        }

        console.log('err in get output amount');
        return 0;
    }
}