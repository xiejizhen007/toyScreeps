import { Role } from "Creeps/Role";
import { CommandCenter } from "Network/CommandCenter";
import { LinkNetwork } from "Network/LinkNetwork";

export class King extends Role {
    commandCenter: CommandCenter;
    linkNetwork: LinkNetwork;
    storage: StructureStorage;

    init(): void {
        this.commandCenter = this.roomNetwork.commandCenter;
        this.linkNetwork = this.roomNetwork.linkNetwork;
        this.storage = this.commandCenter.storage;
    }

    work(): void {
        if (this.commandCenter) {
            this.handleLinkRequest();
            this.moveToPos(this.commandCenter.pos);
            this.tempWork();
        }
    }

    private moveToPos(pos: RoomPosition): void {
        if (this.creep.pos.isEqualTo(pos)) {
            return;
        } else {
            this.creep.goto(pos);
        }
    }

    private tempWork(): void {
        if (this.commandCenter.transportNetwork.haveInputRequest) {
            // console.log('transfer');
            if (this.transferActions()) { return; }
        }

        if (this.commandCenter.transportNetwork.haveOutputRequest) {
            // console.log('withdraw');
            if (this.withdrawActions()) { return; } 
        }

        this.clearResource();
    }

    private transferActions(): boolean {
        const request = this.commandCenter.transportNetwork.findHighPriorityInputRequest;
        if (request) {
            // console.log('have transfer request');
            const amount = Math.min(request.amount, this.creep.store.getCapacity());
            // console.log('amount: ' + amount);
            if (this.creep.store[request.resourceType] > 0) {
                const ret = this.creep.transfer(request.target, request.resourceType, amount);
                // console.log('ret: ' + ret);
            } else {
                this.creep.withdraw(this.storage, request.resourceType, amount);
            }

            return true;
        }

        return false;
    }

    private withdrawActions(): boolean {
        const request = this.commandCenter.transportNetwork.findHighPriorityOutputRequest;
        if (request) {
            // console.log('target: ' + request.target);
            const amount = Math.min(request.amount, this.creep.store.getCapacity());
            // console.log('amount: ' + amount);
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
}