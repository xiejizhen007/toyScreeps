import { Role } from "Creeps/Role";
import { TaskLists } from "Network/TaskLists";
import { StoreStructure } from "types";

/**
 * 房间物流
 */
export class Transfer extends Role {
    taskLists: TaskLists;

    init(): void {
        this.taskLists = this.roomNetwork.taskLists;
        
        if (this.store.getFreeCapacity() == 0) {
            this.isWorking = true;
        } else if (this.store.getUsedCapacity() == 0) {
            this.isWorking = false;
        }
    }

    work(): void {
        if (this.spawning) {
            return;
        }

        if (this.ticksToLive < 20) {
            this.clearBody();
            return;
        }

        if (!this.memory.transferTask) {
            this.roomNetwork.taskLists.findAGoodCarryJob(this);
        }

        if (this.memory.transferTask) {
            const request = this.memory.transferTask;
            if (request.resourceType != 'all' && this.store[request.resourceType] != this.store.getUsedCapacity()) {
                // 清理自身
                this.clearBody();
                return;
            }

            if (this.isWorking) {
                // 身上已经有足够的资源了，送去相应的 target 处
                const target = Game.getObjectById(request.target as Id<Structure>) as StoreStructure;
                if (!target) {
                    console.log("err: 当前 creep: " +this.name + "目标丢失");
                    this.roomNetwork.taskLists.removeDoingJob(this);
                    return;
                }

                const amount = Math.min(this.store[request.resourceType], target.store.getFreeCapacity(request.resourceType as ResourceConstant));
                const ret = this.transferTo(target, request.resourceType as ResourceConstant, amount);
                if (ret == OK) {
                    this.roomNetwork.taskLists.removeDoingJob(this);
                } else if (ret != ERR_NOT_IN_RANGE) {
                    
                } else {
                    this.roomNetwork.taskLists.removeDoingJob(this);
                }
            } else {
                // 获取相应的资源
                const source = Game.getObjectById(request.source as Id<Structure>) as StoreStructure;
                const amount = Math.min(this.store.getFreeCapacity(), source.store[request.resourceType]);
                const ret = this.withdrawFrom(source, request.resourceType as ResourceConstant, amount);
                if (ret == OK) {
                    this.isWorking = true;
                } else if (ret == ERR_NOT_ENOUGH_RESOURCES) {
                    this.roomNetwork.taskLists.removeDoingJob(this);
                    this.isWorking = false;
                }
            }
        } else {
            this.clearBody();
        }
    }

    finish(): void {

    }

    /**
     * 全身清理 
     */
    private clearBody() {
        if (this.roomNetwork.storage) {
            for (const type in this.store) {
                const ret = this.transferTo(this.roomNetwork.storage, type as ResourceConstant);
                if (ret == ERR_FULL) {
                    this.drop(type as ResourceConstant);
                }
                break;
            }
        }
    }
}