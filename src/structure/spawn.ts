export default class SpawnExtension extends StructureSpawn {
    /**
     * 孵化 creep，以及派发填充任务
     */
    public work(): void {
        if (!this.room.memory.spawnTasks) { this.room.memory.spawnTasks = []; }
        
        if (this.spawning) { return; }

    }

    public spawn(): void {
        if (this.room.memory.spawnTasks.length > 0) {

        }
    }

    private getBodyArray(bodySet): BodyPartConstant[] {
        let ret = new Array();
        for (let name in bodySet) {
            for (let i = 0; i < bodySet[name]; i++) {
                ret.push(name);
            }
        }
        return ret;
    }
}