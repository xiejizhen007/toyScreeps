export class TerminalNetwork {
    requests: TerminalNetworkRequest[];
    terminals: StructureTerminal[];

    constructor() {
        this.requests = [];
        this.terminals = [];
    }

    refresh(): void {
        this.requests = [];
    }

    registerRequest(request: TerminalNetworkRequest): void {
        this.requests.push(request);
    }

    handleRequest(): void {
        // 处理请求列表里的
        // TODO：获取能够处理请求的 terminal
    }
}