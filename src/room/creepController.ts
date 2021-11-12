import roomExtension from "./extension";

export default class creepController extends roomExtension {
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
}