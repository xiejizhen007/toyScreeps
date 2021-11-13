export default class roomExtension extends Room {
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

    public removeTransferTask(taskType: string): boolean {
        const task = this.memory.exeTransferTasks.find(f => f.type == taskType);
        const index = this.memory.exeTransferTasks.indexOf(task);
        console.log('remove index: ' + index);
        // this.memory.exeTransferTasks.splice(index, 0);
        console.log(this.memory.exeTransferTasks.splice(index, 1));
        return true;
    }

    public taskToExe(): void {
        const task = this.memory.transferTasks.shift();
        if (task) {
            this.memory.exeTransferTasks.push(task);
        }
    }

    /**
     * 查看当前是否存在当前任务
     * @param taskType 任务类型
     * @returns 
     */
    public hasTransferTask(taskType: string): boolean {
        if (!this.memory.transferTasks) { return false; }
        if (!this.memory.exeTransferTasks) { this.memory.exeTransferTasks = []; }

        const task = this.memory.transferTasks.find(f => f.type == taskType);
        const taskExe = this.memory.exeTransferTasks.find(f => f.type == taskType);

        return task || taskExe ? true : false;
    }
}