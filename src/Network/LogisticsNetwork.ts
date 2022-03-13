import { Role } from "Creeps/Role";
import { Mem } from "Mem";
import { RoomNetwork } from "./RoomNetwork";

export type LogisticsNetworkTarget = 
    | StructureStorage
    | StructureTerminal
    | StructureContainer
    | StructureLink
    | StructureLab
    | Resource
    | Ruin
    | Tombstone

export interface LogisticsNetworkRequest {
    source: string;
    target: string;

    priority: number;
    resourceType: ResourceConstant | 'all';
    amount: number;
}

export interface LogisticsNetworkMemory {
    taskList: LogisticsNetworkRequest[];
    // taskList: { [priority: number]: LogisticsNetworkRequest };

    doingList: {
        creep: Id<Creep>,
        task: LogisticsNetworkRequest,
    }[];
}

export const LogisticsNetworkMemoryDefaults: LogisticsNetworkMemory = {
    taskList: [],
    doingList: []
};

export interface RequestOptions {
}

export class LogisticsNetwork {
    memory: LogisticsNetworkMemory;
    roomNetwork: RoomNetwork;

    constructor(roomNetwork: RoomNetwork) {
        this.roomNetwork = roomNetwork;

        this.memory = Mem.wrap(roomNetwork.memory, 'logisticsNetwork', LogisticsNetworkMemoryDefaults);
    }

    get length(): number {
        return this.memory.taskList.length;
    }

    registerTask(task: LogisticsNetworkRequest) {
        if (this.includeTask(task.target)) {
            return;
        }

        this.memory.taskList.push(task);
    }

    findAGoodJob(creep: Role) {
        if (this.memory.taskList.length > 0) {
            const task = this.memory.taskList.shift();
            creep.memory.transferTask = task;
            this.memory.doingList.push({
                creep: creep.id,
                task: task,
            });
            
            return true;
        } else {
            creep.memory.transferTask = null;

            return false;
        }
    }

    findAGoodJobByStructureType(creep: Role, structureType: string) {
        const tasks = _.filter(this.memory.taskList, f => {
            const s = Game.getObjectById(f.target as Id<Structure>);
            if (s && s.structureType == structureType) {
                return true;
            }
        });

        // 转换为对象
        const objs = _.map(tasks, f => Game.getObjectById(f.target as Id<Structure>));
        const obj = creep.pos.findClosestByPath(objs);

        if (obj) {
            // 在当前的任务队列中删除最优任务
            const task = _.find(this.memory.taskList, f => f.target == obj.id);
            _.remove(this.memory.taskList, f => f.target == obj.id);

            creep.memory.transferTask = task;
            this.memory.doingList.push({
                creep: creep.id,
                task: task,
            });

            return true;
        } else {
            // 当前类型建筑的任务已经没有了，重新找任务
            return this.findAGoodJob(creep);
        }
    }

    removeDoingJob(creep: Role) {
        creep.memory.transferTask = null;
        _.remove(this.memory.doingList, f => f.creep == creep.id);
    }

    private includeTask(target: string) {
        // return _.find(this.memory.taskList, f => f.target == target) || _.find;
        const findTarget = _.find(this.memory.taskList, f => f.target == target) 
            || _.find(this.memory.doingList, f => f.task.target == target);
        
        return findTarget != undefined;
    }

    clearUselessJob() {
        if (Game.time % 10 == 0) {
            this.memory.doingList = [];
        }
    }
}