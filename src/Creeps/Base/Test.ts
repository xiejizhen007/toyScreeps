import { Role } from "Creeps/Role";
import { Tasks } from "Tasks/Tasks";

export class Test extends Role {
    init(): void {
        // console.log('hhhh');
        if (this.roomNetwork.transportNetwork.haveInputRequest()) {
            console.log('have input request');
        } else if (this.roomNetwork.transportNetwork.haveOutputRequest()) {
            console.log('have output request');
        }
    }

    work(): void {
        if (this.task) {
            this.task.work();
            return;
        }

        if (this.transferActions(this)) {}
        else if (this.withdrawActions(this)) {}

        if (this.task) {
            this.task.work();
        }
    }

    private transferActions(creep: Role) {
        const request = creep.roomNetwork.transportNetwork.findHighPriorityInputRequest(creep.pos);
        if (request) {
            const amount = Math.min(request.amount, creep.store.getCapacity());

            if (creep.store[request.resourceType] > 0) {
                const minAmount = Math.min(creep.store[request.resourceType], amount)
                creep.task = Tasks.transfer(request.target, request.resourceType, minAmount);
            } else {
                if (creep.roomNetwork.storage && creep.roomNetwork.storage.store[request.resourceType] > 0) {
                    const minAmount = Math.min(creep.roomNetwork.storage.store[request.resourceType], amount);
                    creep.task = Tasks.withdraw(creep.roomNetwork.storage, request.resourceType, minAmount);
                } else if (creep.roomNetwork.terminal && creep.roomNetwork.terminal.store[request.resourceType] > 0) {
                    const minAmount = Math.min(creep.roomNetwork.terminal.store[request.resourceType], amount);
                    creep.task = Tasks.withdraw(creep.roomNetwork.terminal, request.resourceType, minAmount);
                } else {
                    return false;
                }
            }

            return true;
        } 

        return false;
    }

    private withdrawActions(creep: Role) {
        const request = creep.roomNetwork.transportNetwork.findHighPriorityOutputRequest(creep.pos);
        if (request) {
            const amount = Math.min(request.amount, creep.store.getCapacity());

            if (creep.store[request.resourceType] > 0) {
                if (creep.roomNetwork.storage && creep.roomNetwork.storage.store[request.resourceType] > 0) {
                    const minAmount = Math.min(creep.roomNetwork.storage.store[request.resourceType], amount);
                    creep.task = Tasks.transfer(creep.roomNetwork.storage, request.resourceType, minAmount);
                } else if (creep.roomNetwork.terminal && creep.roomNetwork.terminal.store[request.resourceType] > 0) {
                    const minAmount = Math.min(creep.roomNetwork.terminal.store[request.resourceType], amount);
                    creep.task = Tasks.transfer(creep.roomNetwork.terminal, request.resourceType, minAmount);
                } else {
                    return false;
                }
            } else {
                const minAmount = Math.min(creep.store[request.resourceType], amount)
                creep.task = Tasks.withdraw(request.target, request.resourceType, minAmount);
            }

            return true;
        }

        return false;
    }
}