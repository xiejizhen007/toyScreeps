import { Role } from "Creeps/Role";
import { TransportNetwork } from "Network/TransportNetwork";

/**
 * 负责将采集的能量送回中央
 */
export class Transfer extends Role {
    transportNetwork: TransportNetwork;

    init(): void {
        this.transportNetwork = this.roomNetwork.transportNetworkForTransfer;
        this.getOutputTask();
    }

    work(): void {
        if (this.isWorking) {           // 去 output target 处取物质
            this.handleOutputTask();
        } else {                        // 送回中央
            // if (this.creep.store.getUsedCapacity() == 0) {
            //     this.isWorking = true;
            // }

            const storage = this.roomNetwork.storage;
            const terminal = this.roomNetwork.terminal;

            if (storage) {
                if (this.creep.pos.isNearTo(storage)) {
                    for (const resource in this.creep.store) {
                        const resourceType = resource as ResourceConstant;
                        this.creep.transfer(storage, resourceType);
                        break;
                    }
                } else {
                    this.creep.goto(storage.pos);
                }
            }
        }
    }

    private getOutputTask(): void {
        if (!this.isWorking && this.creep.store.getUsedCapacity() == 0) {
            const req = this.transportNetwork.findHighPriorityOutputRequest(this.pos);
            
            if (req) {
                this.creep.memory.tempTask = {
                    type: 'transfer',
                    target: req.target.id,
                    targetPos: req.target.pos,
                    resourceType: req.resourceType,
                    amount: req.amount
                }

                this.isWorking = true;
            }
        }
    }

    private handleOutputTask() {
        const target = Game.getObjectById(this.creep.memory.tempTask.target as Id<StructureContainer>);
        if (target) {
            if (this.creep.pos.isNearTo(target)) {
                const resourceType = this.creep.memory.tempTask.resourceType;
                const amount = Math.min(this.creep.store.getFreeCapacity(), target.store[resourceType]);
                const ret = this.creep.withdraw(target, resourceType, amount);
                if (ret == OK) {
                    this.isWorking = false;
                }
            } else {
                this.creep.goto(target.pos);
                return ERR_NOT_IN_RANGE;
            }
        }
    }
}