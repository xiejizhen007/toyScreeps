import RoomExtension from "./extension";

export default class creepController extends RoomExtension {
    /**
     * 添加外矿采集组
     * @param roomName 外矿的房间
     */
    public addRoomCreepGroup(roomName: string): boolean {
        const sourceFlagName = [roomName + 'Source0', roomName + 'Source1', roomName + 'Source2'];
        sourceFlagName.forEach(flagName => {
            let flag = Game.flags[flagName];
            if (!flag) { return; }

            this.addRoleSpawnTask('harvesterRoom', true, roomName, flag.name);
        });

        this.addRoomReserver(roomName);
        return true;
    }

    /**
     * 外矿房间预定，配合采集者使用
     * @param roomName 添加预定的房间
     * @returns 
     */
    public addRoomReserver(roomName: string): boolean {
        this.addRoleSpawnTask('reserver', false, roomName);
        return true;
    }
    
    /**
     * 检查房间矿产还有没有，矿产存在派一个去挖
     * 注意避免重复派遣
     */
    public addMineral(): boolean {
        // let mineral = this.find(FIND_MINERALS)[0];
        let mineral = Game.getObjectById(this.memory.mineralID);
        if (!mineral) {
            mineral = this.find(FIND_MINERALS)[0];
            if (mineral) {
                this.memory.mineralID = mineral.id;
            }
        }

        if (mineral && mineral.ticksToRegeneration == 50) {
            this.addRoleSpawnTask('harvesterMineral', true);
            return true;
        }

        return false;
    }
}