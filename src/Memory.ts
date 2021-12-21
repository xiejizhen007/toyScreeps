// 全局使用的 memory
// 以及对于 object.memory 的访问

export class MMemory {
    // 清理不存在的 memory
    static clean(): void {
        this.cleanCreeps();
        this.cleanFlags();
    }

    private static cleanCreeps(): void {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('delete non-existing creep memory:', name);
            }
        }
    }

    private static cleanFlags(): void {
        for (const name in Memory.flags) {
            if (!Game.flags[name]) {
                delete Memory.flags[name];
                console.log('delete non-existing flag memory:', name);
            }
        }
    }

    // private static addRoomTransportTask(room: Room): bool {

    // }


    /**
     * 白名单
     */
    static addWhiteList(name: string): boolean {
        if (!Memory.whiteList) {
            Memory.whiteList = [];
        }

        if (!_.includes(Memory.whiteList, name)) {
            Memory.whiteList.push(name);
            return true;
        } else {
            console.log('%s is already on the white list');
            return false;
        }
    }

    static removeWhiteList(name: string): boolean {
        Memory.whiteList = _.remove(Memory.whiteList, rm => {
            console.log('white list: ' + rm + ' check with ' + name);
            return rm != name
        });
        return true;
    }

    static hasWhiteList(name: string): boolean {
        if (!Memory.whiteList) {
            Memory.whiteList = new Array();
            return false;
        }

        return _.includes(Memory.whiteList, name);
    }
}