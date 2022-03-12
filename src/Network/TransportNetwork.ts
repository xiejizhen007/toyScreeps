import { Priority } from "setting";

export interface TransportRequest {
    target: Structure;
    resourceType: ResourceConstant;
    amount: number;
    priority: number;
}

export interface TransportRequestOptions {
    resourceType?: ResourceConstant;
    amount?: number;
}

export class TransportNetwork {
    // input: TransportRequest[];
    // output: TransportRequest[];
    input: { [priority: number]: TransportRequest[] };
    output: { [priority: number]: TransportRequest[] };

    constructor() {
        // this.input = [];
        // this.output = [];
        this.input = this.registerQueue();
        this.output = this.registerQueue();
    }

    private registerQueue() {
        const queue: { [priority: number]: any[] } = {};
        for (const priority in Priority) {
            queue[priority] = [];
        }
        return queue;
    }

    private haveRequest(queue: {[priority: number]: TransportRequest[]}): boolean {
        for (const priority in Priority) {
            if (queue[priority].length > 0) {
                return true;
            }
        }

        return false;
    }

    haveInputRequest(): boolean {
        // return this.input.length > 0;
        return this.haveRequest(this.input);
    }

    haveOutputRequest(): boolean {
        // return this.output.length > 0;
        return this.haveRequest(this.output);
    }

    requestInput(target: Structure, priority = Priority.Normal, opts = {} as TransportRequestOptions) {
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
            this.input[priority].push(req);
        }
    }

    requestOutput(target: Structure, priority = Priority.Normal, opts = {} as TransportRequestOptions) {
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
            this.output[priority].push(req);
        }
    }

    findHighPriorityInputRequest(pos: RoomPosition): TransportRequest | undefined {
        for (const priority in Priority) {
            const targets = _.map(this.input[priority], m => m.target);
            const target = pos.findClosestByRange(targets);

            if (target) {
                return _.find(this.input[priority], f => f.target.id == target.id);
            }
        }

        return undefined;
    }
    
    findHighPriorityOutputRequest(pos: RoomPosition): TransportRequest | undefined {
        for (const priority in Priority) {
            const targets = _.map(this.output[priority], m => m.target);
            const target = pos.findClosestByRange(targets);

            if (target) {
                return _.find(this.output[priority], f => f.target.id == target.id);
            }
        }

        return undefined;
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
        } else if (target instanceof StructureExtension || target instanceof StructureSpawn) {
            return target.store.getFreeCapacity(RESOURCE_ENERGY);
        }

        console.log('err in get input amount, target: ' + target.id);
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