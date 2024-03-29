import { Role } from "Creeps/Role";
import { CommandCenter } from "Network/CommandCenter";
import { LinkNetwork } from "Network/LinkNetwork";
import { Priority } from "setting";

/**
 * TODO: 记录当前的任务
 */
export class King extends Role {
    commandCenter: CommandCenter;
    linkNetwork: LinkNetwork;
    storage: StructureStorage;

    init(): void {
        this.commandCenter = this.roomNetwork.commandCenter;
        this.linkNetwork = this.roomNetwork.linkNetwork;
        
        if (this.commandCenter)
            this.storage = this.commandCenter.storage;
    }

    work(): void {
        if (this.commandCenter) {
            this.handleLinkRequest();
            this.handleTerminalRequest();
            this.moveToPos(this.commandCenter.pos);
            this.tempWork();
        }
    }

    finish(): void {

    }

    private moveToPos(pos: RoomPosition): void {
        if (this.creep.pos.isEqualTo(pos)) {
            return;
        } else {
            this.goto(pos);
        }
    }

    private tempWork(): void {
        if (this.commandCenter.transportNetwork.haveOutputRequest()) {
            if (this.withdrawActions()) { return; } 
        }

        if (this.commandCenter.transportNetwork.haveInputRequest()) {
            if (this.transferActions()) { return; }
        }

        this.clearResource();
    }

    private transferActions(): boolean {
        const request = this.commandCenter.transportNetwork.findHighPriorityInputRequest(this.pos);
        if (request) {
            console.log(this.room.name + ' have transfer task');
            if (this.creep.store[request.resourceType] != this.creep.store.getUsedCapacity()) {
                // this.creep.transfer(th)
                for (const type in this.store) {
                    if (type != request.resourceType) {
                        this.creep.transfer(this.commandCenter.storage, type as ResourceConstant);
                        break;
                    }
                }
            
                return true;
            }
            
            // console.log(this.room.name + ' should be transfer ');

            const amount = Math.min(request.amount, this.creep.store.getCapacity());
            
            console.log(this.room.name + ' resourceType: ' + request.resourceType + ' amount: ' + amount);
            if (this.creep.store[request.resourceType] > 0) {
                const ret = this.creep.transfer(request.target, request.resourceType, Math.min(amount, this.creep.store[request.resourceType]));
            } else {
                if (this.commandCenter.storage && this.commandCenter.storage.store[request.resourceType] > 0) {
                    this.creep.withdraw(this.commandCenter.storage, request.resourceType, Math.min(amount, this.commandCenter.storage.store[request.resourceType]));
                } else if (this.commandCenter.terminal && this.commandCenter.terminal.store[request.resourceType] > 0) {
                    this.creep.withdraw(this.commandCenter.terminal, request.resourceType, Math.min(amount, this.commandCenter.terminal.store[request.resourceType]));
                }
            }

            return true;
        }

        return false;
    }

    private withdrawActions(): boolean {
        const request = this.commandCenter.transportNetwork.findHighPriorityOutputRequest(this.pos);
        if (request) {
            if (this.creep.store[request.resourceType] != this.creep.store.getUsedCapacity()) {
                for (const type in this.store) {
                    if (type != request.resourceType) {
                        this.creep.transfer(this.commandCenter.storage, type as ResourceConstant);
                        break;
                    }
                }
            
                return true;
            }

            const amount = Math.min(request.amount, this.creep.store.getCapacity());
            if (this.creep.store[request.resourceType] < amount) {
                const minAmount = Math.min(amount, this.creep.store.getFreeCapacity());
                this.creep.withdraw(request.target, request.resourceType, minAmount);
            } else {
                this.creep.transfer(this.storage, request.resourceType, amount);
            }

            return true;
        }

        return false;
    }

    private clearResource(): void {
        if (this.creep.store.getUsedCapacity() > 0) {
            for (const resourceType in this.creep.store) {
                if (this.storage) {
                    this.creep.transfer(this.storage, resourceType as ResourceConstant);
                }
            }
        }
    }

    private handleLinkRequest(): boolean {
        if (this.linkNetwork.receiveLinks.length > 0 && this.linkNetwork.sendLinks.length == 0 && this.commandCenter.link) {
            this.commandCenter.transportNetwork.requestInput(this.commandCenter.link);
            return true;
        }
        
        return false;
    }

    private handleTerminalRequest(): boolean {
        const req = _.find(Kernel.terminalNetwork.memory.request, f => f.room == this.room.name) as any;
        if (req && this.room.terminal && this.room.terminal.my) {
            if (!req.input) {
                console.log('terminal output');
                this.commandCenter.transportNetwork.requestOutput(this.room.terminal, Priority.Normal, {
                    resourceType: req.resourceType,
                    amount: req.amount
                });
                return true;
            } else {
                console.log('terminal input');
                this.commandCenter.transportNetwork.requestInput(this.room.terminal, Priority.Normal, {
                    resourceType: req.resourceType,
                    amount: req.amount
                });
                return true;
            }
        }

        return false;
    }
}