export default class roomExtension extends Room {
    /**
     * 添加外矿房间
     * @param roomName 外矿房间名
     */
    public addHarvestRoom(roomName: string): boolean {
        if (!this.memory.harvestRoom) { this.memory.harvestRoom = []; }

        if (!this.memory.harvestRoom.find(f => f.roomName == roomName)) {
            this.memory.harvestRoom.push({
                roomName: roomName,
                hasReserver: false,
            });
            
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