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
        _.remove(Memory.whiteList, rm => rm == name);
        return true;
    }

    static hasWhiteList(name: string): boolean {
        if (!Memory.whiteList) {
            Memory.whiteList = new Array();
            return false;
        }

        return _.includes(Memory.whiteList, name);
    }

    static addAvoidRoom(target: AvoidRoom): boolean {
        if (!Memory.avoidRoom) {
            Memory.avoidRoom = [];
        }

        if (!_.find(Memory.avoidRoom, f => f.roomName == target.roomName)) {
            Memory.avoidRoom.push(target);
            return true;
        } else {
            return false;
        }
    }

    static removeAvoidRoom(target: string): boolean {
        if (!Memory.avoidRoom) {
            return false;
        }

        _.remove(Memory.avoidRoom, f => f.roomName == target);
        return true;
    }

    static shouldAvoidRoom(roomName: string): boolean {
        if (!Memory.avoidRoom) {
            return false;
        }

        return _.find(Memory.avoidRoom, f => f.roomName == roomName) ? true : false;
    }

    static wrap(memory: any, name: string, defaults = {}, deep = false): void {
        if (!memory[name]) {
            memory[name] = _.clone(defaults);
        }

        if (deep) {
            _.defaultsDeep(memory[name])
        } else {
            _.defaults(memory[name]);
        }

        return memory[name];
    }
}