export default class roomExtension extends Room {
    public addRoleSpawnTask(role: string, isNeeded?: boolean, workRoomName?: string, flagName?: string): boolean {
        if (!this.memory.spawnTasks) { this.memory.spawnTasks = []; }

        this.memory.spawnTasks.push({
            role: role,
            room: this.name,
            isNeeded: isNeeded ? true : false,
            task: {
                workRoomName: workRoomName ? this.name : workRoomName,
                flagName: flagName,
            }
        });

        console.log(this.name + ' add role spawn task');
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
}