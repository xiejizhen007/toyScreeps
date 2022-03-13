import { TerminalNetwork } from "Network/TerminalNetwork";

/**
 * 全局对象，缓存对象
 */
export class _Kernal implements IKernal {
    roles: { [creepName: string]: any; };
    roomNetworks: { [roomName: string]: any; };
    terminalNetwork: ITerminalNetwork;

    constructor() {
        // 构建对象
        this.roles = {};
        this.roomNetworks = {};

        // TODO
        this.terminalNetwork = new TerminalNetwork([]);
    }

    build(): void {
        
    }

    refresh(): void {
        
    }

    init(): void {
        for (const name in this.roomNetworks) {
            if (this.roomNetworks[name]) {
                this.roomNetworks[name].init();
            } else {
                delete this.roomNetworks[name];
            }
        }

        for (const name in this.roles) {
            if (this.roles[name]) {
                this.roles[name].init();
            } else {
                delete this.roles[name];
            }
        }

        if (this.terminalNetwork) {
            this.terminalNetwork.init();
        }
    }

    work(): void {
        for (const name in this.roomNetworks) {
            if (this.roomNetworks[name]) {
                this.roomNetworks[name].work();
            } else {
                delete this.roomNetworks[name];
            }
        }

        for (const name in this.roles) {
            if (this.roles[name]) {
                this.roles[name].work();
            } else {
                delete this.roles[name];
            }
        }

        if (this.terminalNetwork) {
            this.terminalNetwork.work();
        }
    }
}