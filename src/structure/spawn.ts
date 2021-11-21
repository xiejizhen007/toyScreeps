export default class SpawnExtension extends StructureSpawn {
    /**
     * 孵化 creep，以及派发填充任务
     */
    public work(): void {
        if (!this.room.memory.spawnTasks) { this.room.memory.spawnTasks = []; }
        
        
    }
}