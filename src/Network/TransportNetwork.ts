export interface TransportRequest {
    target: Structure;
    resourceType: ResourceConstant;
    amount: number;
    priority: number;
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

    requestInput(target: TransportRequest) {
        this.input.push(target);
    }

    requestOutput(target: TransportRequest) {
        this.output.push(target);
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
}