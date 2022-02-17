import { Role } from "Creeps/Role";
import { CommandCenter } from "Network/CommandCenter";

export class King extends Role {
    commandCenter: CommandCenter;

    storage: StructureStorage;

    init(): void {
        this.commandCenter = this.roomNetwork.commandCenter;
        this.storage = this.commandCenter.storage;
    }

    work(): void {
        if (this.commandCenter) {
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
            console.log('transfer');
            if (this.transferActions()) { return; }
        }

        if (this.commandCenter.transportNetwork.haveOutputRequest) {
            console.log('withdraw');
            if (this.withdrawActions()) { return; } 
        }
    }

    // private handleLink(): void {

    // }

    private transferActions(): boolean {
        const request = this.commandCenter.transportNetwork.findHighPriorityInputRequest;
        if (request) {
            const amount = Math.min(request.amount, this.creep.store.getCapacity());
            if (this.creep.store[request.resourceType] > 0) {
                this.creep.transfer(request.target, request.resourceType, amount);
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
            console.log('target: ' + request.target);
            const amount = Math.min(request.amount, this.creep.store.getCapacity());
            if (this.creep.store[request.resourceType] == 0) {
                this.creep.withdraw(this.storage, request.resourceType, amount);
            } else {
                this.creep.transfer(request.target, request.resourceType, amount);
            }

            return true;
        }

        return false;
    }
}