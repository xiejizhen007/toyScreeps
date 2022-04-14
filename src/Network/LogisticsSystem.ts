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

    /**
     * 根据优先级生成队列
     */
    private registerQueue() {
        const queue: { [priority: number]: any[] } = {};

        for (const priority in Priority) {
            queue[priority] = [];
        }

        return queue;
    }

    push(task: LogisticsSystemRequest, priority: number = Priority.Normal): void {
        this.requests[priority].push(task);
    }

    pop(): LogisticsSystemRequest {
        for (const priority in Priority) {
            if (this.requests[priority].length > 0) {
                return this.requests[priority].shift();
            }
        }

        return null;
    }
}