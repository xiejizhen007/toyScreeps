import { Priority } from "setting";

export interface LogisticsSystemRequest {
    source: string;
    target: string;

    resourceType: ResourceConstant;
    amount?: number;
}

export class LogisticsSystem {
    requests: { [priority: number]: LogisticsSystemRequest[] };

    constructor() {
        this.requests = this.registerQueue();
    }

    private registerQueue() {
        const queue: { [priority: number]: any[] } = {};
        for (const priority in Priority) {
            queue[priority] = [];
        }
        return queue;
    }

    insert(task: LogisticsSystemRequest, priority: number = Priority.Normal): void {
        this.requests[priority].push(task);
    }

    findHighPriorityTask(): LogisticsSystemRequest {
        for (const priority in Priority) {
            if (this.requests[priority].length > 0) {
                return this.requests[priority].shift();
            }
        }

        return null;
    }
}