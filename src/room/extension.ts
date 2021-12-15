import { NumericDictionary } from "lodash";

export default class RoomExtension extends Room {
    public addRoleSpawnTask(role: string, isNeeded?: boolean, workRoomName?: string, flagName?: string): boolean {
        if (!this.memory.spawnTasks) { this.memory.spawnTasks = []; }

        this.memory.spawnTasks.push({
            role: role,
            room: this.name,
            isNeeded: isNeeded ? true : false,
            task: {
                workRoomName: workRoomName ? workRoomName : this.name,
                flagName: flagName,
            }
        });

        console.log(this.name + ' add role spawn task');
        return true;
    }
    
    /**
     * 孵化 creep
     * @param creep 需要孵化的 creep
     */
    public addSpawnTask(creep: Creep): boolean {
        if (!this.memory.spawnTasks) { this.memory.spawnTasks = []; }

        this.memory.spawnTasks.push({
            role: creep.memory.role,
            room: creep.memory.room,
            isNeeded: creep.memory.isNeeded,
            task: creep.memory.task
        });

        creep.memory.isNeeded = false;
        return true;
    }

    /**
     * 
     * @param role 
     * @param isNeeded 
     * @param boostType 需要 boost 的操作
     * @param level boost 等级，使用几级化合物，必须指定
     * @param workRoomName 
     * @param flagName 
     */
    public addBoostRole(role: string, isNeeded: boolean, boostType: string[], level: number, workRoomName?: string, flagName?: string) {
        if (!this.memory.spawnTasks) { this.memory.spawnTasks = []; }

        this.memory.spawnTasks.push({
            role: role,
            room: this.name,
            isNeeded: isNeeded,
            task: {
                workRoomName: workRoomName,
                flagName: flagName
            },
            boost: true,
            boostType: boostType,
            boostLevel: level
        });

        console.log('add boost role: ' + role);
        this.memory.boost.count++;
        return true;
    }

    public addBoostCreep(creep: Creep) {
        if (!this.memory.spawnTasks) { this.memory.spawnTasks = []; }

        this.memory.spawnTasks.push({
            role: creep.memory.role,
            room: this.name,
            isNeeded: creep.memory.isNeeded,
            task: {
                workRoomName: creep.memory.task.workRoomName,
                flagName: creep.memory.task.flagName
            },
            boost: true,
            boostType: creep.memory.boostType,
            boostLevel: creep.memory.boostLevel
        });

        console.log('add boost role: ' + creep.memory.role);
        this.memory.boost.count++;
        return true;
    }

    /**
     * 添加外矿房间
     * @param roomName 外矿房间名
     */
    public addHarvestRoom(roomName: string): boolean {
        const sourceFlagName = [roomName + 'Source0', roomName + 'Source1', roomName + 'Source2'];
        // 保证外矿有旗
        if (!(sourceFlagName[0] in Game.flags)) {
            console.log('给外矿插旗，roomName + Source 0 ~ 2');
            return false;
        }

        if (!this.memory.harvestRoom) { this.memory.harvestRoom = []; }

        if (!this.memory.harvestRoom.find(f => f.roomName == roomName)) {
            this.memory.harvestRoom.push({
                roomName: roomName,
                hasReserver: true,
            });
            
            this.addRoomCreepGroup(roomName);
            return true;
        }

        return false;
    }

    /**
     * 删除外矿
     * @param roomName 外矿房间名
     */
    public removeHarvestRoom(roomName: string): boolean {
        if (!this.memory.harvestRoom) { return false; }

        // 只有在外矿房间存在的时候才进行删除
        let findRoom = this.memory.harvestRoom.find(f => f.roomName == roomName);
        if (findRoom) {
            this.memory.harvestRoom.splice(this.memory.harvestRoom.indexOf(findRoom));
            return true;
        }

        return false;
    }

    /**
     * 
     * @param task 任务对象
     * @param priority 任务优先级，默认添加任务到队尾
     * @returns 
     */
    public addTransferTask(task: roomTransferTask, priority?: number): number {
        if (!this.memory.transferTasks) { this.memory.transferTasks = []; }
        if (this.hasTransferTask(task.type)) { return -1; }
        
        if (priority != undefined) {
            // 防止过长
            this.memory.transferTasks.splice(priority, 0, task);
            return priority < this.memory.transferTasks.length ? priority : this.memory.transferTasks.length - 1;
        }
        else {
            // 插入队尾
            this.memory.transferTasks.push(task);
            return this.memory.transferTasks.length - 1;
        }
    }

    public removeTransferTask(): boolean {
        this.memory.transferTasks.shift();
        return true;
    }

    /**
     * 查看当前是否存在当前任务
     * @param taskType 任务类型
     * @returns 
     */
    public hasTransferTask(taskType: string): boolean {
        if (!this.memory.transferTasks) { return false; }

        const task = this.memory.transferTasks.find(f => f && f.type == taskType);
        return task ? true : false;
    }

    public getTransferTask(): roomTransferTask {
        return this.memory.transferTasks[0];
    }

    /**
     * 只有八级房才能烧 power
     */
    public buyPower(): void {
        const storage = this.storage;
        const terminal = this.terminal;
        const controller = this.controller;

        if (storage && terminal && controller && controller.my && controller.level == 8) {
            const powerAmount = storage.store[RESOURCE_POWER] + terminal.store[RESOURCE_POWER];
            const energyAmount = storage.store[RESOURCE_ENERGY] + terminal.store[RESOURCE_ENERGY];
            // 一般都是 3000 一单，所以把能力限制在 150000 以上
            if (powerAmount <= 100 && energyAmount >= 150000) {
                let orders = Game.market.getAllOrders({type: ORDER_SELL, resourceType: RESOURCE_POWER});
                orders.sort((a, b) => a.price - b.price);
                for (const i in orders) {
                    // console.log(orders[i].price + ' ' + orders[i].amount);
                    if (Game.market.deal(orders[i].id, orders[i].amount, this.name) == OK) {
                        console.log(this.name + ' buyPower: ' + orders[i].amount);
                        return;
                    }
                }
            }
        }
    }

    public sell(resourceType: ResourceConstant): ScreepsReturnCode {
        let orders = Game.market.getAllOrders({
            type: ORDER_BUY,
            resourceType: resourceType
        });

        orders.sort((a, b) => b.price - a.price);
        if (orders.length > 0) {
            // console.log('orders price: ' + orders[0].price);
            return Game.market.deal(orders[0].id, orders[0].amount, this.name);
        }
        return OK;
    }
}