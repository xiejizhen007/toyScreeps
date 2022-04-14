import { RoleCarry } from "Creeps/RoleCarry";
import { LogisticsSystem, LogisticsSystemRequest } from "Network/LogisticsSystem";
import { StoreStructure } from "types";

export class TestTransfer extends RoleCarry {
    task: LogisticsSystemRequest;
    lsystem: LogisticsSystem;

    init(): void {
        this.lsystem = this.roomNetwork.logisticsSystem;

        // test code
        // if (Game.time % 10 == 0) {
            // this.lsystem.push({
            //     source: this.room.storage.id,
            //     target: this.room.terminal.id,
            //     resourceType: 'energy',
            //     amount: 2000,
            // });
        // }


        if (this.memory.transferTask) {
            const req = this.memory.transferTask;
            this.task = {
                source: req.source,
                target: req.target,
                resourceType: req.resourceType as ResourceConstant,
                amount: req.amount,
            };
        } else {
            this.task = this.lsystem.pop();
        }


    }

    work(): void {
        if (!this.task) {
            return;
        }

        _.defaults(this.task, {
            amount: 0,
        });

        console.log('have a job: ' + this.task.amount);

        const source = Game.getObjectById(this.task.source as Id<StoreStructure>);
        const target = Game.getObjectById(this.task.target as Id<StoreStructure>);
        const resourceType = this.task.resourceType;

        // 清理身上多余的东西
        if (this.store.getUsedCapacity() != this.store[resourceType]) {
            if (this.roomNetwork.storage) {
                for (const rt in this.store) {
                    if (rt != resourceType) {
                        this.transferResource(this.roomNetwork.storage, rt as ResourceConstant);
                    }
                }
            } else {
                for (const rt in this.store) {
                    if (rt != resourceType) {
                        this.drop(rt as ResourceConstant);
                    }
                }
            }

            return;
        }

        // 从源取资源

        if (this.store.getFreeCapacity() && source.store[resourceType] && this.task.amount) {
            const wAmount = Math.min(this.store.getFreeCapacity(), source.store[resourceType], this.task.amount);
            if (wAmount == 0) {
                console.warn("wAmount is zero");
                return;
            }

            const ret = this.withdrawResource(source, resourceType, wAmount);
            return;
        }

        // 送往目标存储
        if (this.store[resourceType] && this.task.amount) {
            const tAmount = Math.min(this.store[resourceType], this.task.amount, target.store.getFreeCapacity(resourceType));
            const ret = this.transferResource(target, resourceType, tAmount);

            if (ret == OK) {
                this.task.amount -= tAmount;
            }

            return;
        } else {
            this.task = this.lsystem.pop();
        }
    }

    finish(): void {
        this.memory.transferTask = this.task;
    }
}