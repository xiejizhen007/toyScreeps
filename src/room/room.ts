export default class roomExtension extends Room {
    /**
     * 
     * @param task 任务类型
     */
    public addTransferTask(task: roomTransferTask) : number {
        if (!this.memory.transferTasks) { this.memory.transferTasks = []; }

        this.memory.transferTasks.push(task);
        return this.memory.transferTasks.length() - 1;
    }

    public hasTransferTask(taskType: string) : boolean {
        if (!this.memory.transferTasks) { this.memory.transferTasks = []; }

        const taskYes = this.memory.transferTasks.find(task => task.type == taskType);
        return taskYes ? true : false;
    }
}