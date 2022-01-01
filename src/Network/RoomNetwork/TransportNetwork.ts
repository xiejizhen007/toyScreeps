export class TransportNetwork {
    inputs: TransportNetworkRequests[];
    outputs: TransportNetworkRequests[];

    constructor() {
        this.refresh();
    }

    refresh(): void {
        this.inputs = [];
        this.outputs = [];
    }

    requestInput(target: TransportNetworkTarget, opts = {} as TransportNetworkOptions): void {
        _.defaults(opts, {
            resourceType: RESOURCE_ENERGY,
        });

        if (opts.amount == undefined) {
            opts.amount = this.getInputAmount(target, opts.reosurceType);
        }

        const request: TransportNetworkRequests = {
            target: target,
            amount: opts.amount,
            reosurceType: opts.reosurceType,
        };

        if (opts.amount > 0) {
            this.inputs.push(request);
        }
    }

    requestOutput(target: TransportNetworkTarget, opts = {} as TransportNetworkOptions): void {
        _.defaults(opts, {
            resourceType: RESOURCE_ENERGY,
        });

        if (opts.amount == undefined) {
            opts.amount = this.getOutputAmount(target, opts.reosurceType);
        }

        const request: TransportNetworkRequests = {
            target: target,
            amount: opts.amount,
            reosurceType: opts.reosurceType,
        };

        if (opts.amount > 0) {
            this.inputs.push(request);
        }
    }

    private getInputAmount(target: TransportNetworkTarget, resourceType: ResourceConstant): number {
        return target.store.getFreeCapacity(resourceType);
    }

    private getOutputAmount(target: TransportNetworkTarget, resourceType: ResourceConstant): number {
        return target.store[resourceType];
    }
}