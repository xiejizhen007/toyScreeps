export default class creepExtension extends Creep {
    public work(): void {
        console.log('sss');
        return;
    }

    /**
     * 将 creep 身上的资源转移到目标建筑当中
     * @param target 目标建筑
     * @param resourceType 资源类型
     * @returns 
     */
    public transferTo(target: Structure, resourceType: ResourceConstant): ScreepsReturnCode {
        if (!target) { return ERR_INVALID_TARGET; }

        if (this.pos.inRangeTo(target, 1)) { return this.transfer(target, resourceType); }

        this.goTo(target.pos);
        return ERR_NOT_IN_RANGE;
    }

    public goTo(target: RoomPosition): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
        const ret = this.moveTo(target);
        return ret;
    }

    /**
     * 从 target 获取能量
     * @param target 建筑或者是能量源
     * @returns 
     */
    public getEnergyFrom(target: Structure | Source): ScreepsReturnCode {
        if (!this.pos.inRangeTo(target, 1)) { 
            this.goTo(target.pos);
            return ERR_NOT_IN_RANGE; 
        }

        let ret: ScreepsReturnCode;
        if (target instanceof Structure) { ret = this.withdraw(target, RESOURCE_ENERGY); }
        else { ret = this.harvest(target); }

        return ret;
    }

    /**
     * 前往远距离的目标
     * @param target 目标地点
     */
    public farGoTo(target: RoomPosition): CreepMoveReturnCode {
        if (!this.memory.farMove) { this.memory.farMove = {}; }

        // 目标发生了变化
        let targetPos = this.memory.farMove.targetPos;
        if (!targetPos || targetPos != target) {
            this.memory.farMove.targetPos = target;
            this.findPath(target);
        }

        // paths 不存在
        if (!this.memory.farMove.paths) { this.findPath(target); }

        // 真没路了
        if (!this.memory.farMove.paths) { 
            console.log('no road: delete paths');
            delete this.memory.farMove.paths;
            return OK;
        }

        let targetIndex = this.memory.farMove.index;
        // 到达目的地了
        if (targetIndex >= this.memory.farMove.paths.length) {
            delete this.memory.farMove.index;
            return OK;
        }

        // 还没到目的地，继续前进
        let ret = this.move(this.pos.getDirectionTo(this.memory.farMove.paths[targetIndex]));
        if (ret == OK) { this.memory.farMove.index++; }
        
        return ret;
    }

    public findPath(target: RoomPosition) {
        if (!this.memory.farMove) { this.memory.farMove = {}; }
        this.memory.farMove.index = 0;

        // 路径
        const road = PathFinder.search(this.pos, target, {
            plainCost: 2,
            swampCost: 10,
            maxOps: 2000,
            roomCallback: function(roomName) {
                if (Memory.enemyRoom && Memory.enemyRoom.includes(roomName)) return false;

                let room = Game.rooms[roomName];
                // 莫得视野
                // if (!room) return;

                let costs = new PathFinder.CostMatrix;
                if (room) {
                    room.find(FIND_STRUCTURES).forEach(function(struct) {
                        if (struct.structureType == STRUCTURE_ROAD)
                        // 有路就走路，别淤住
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        else if (struct.structureType != STRUCTURE_CONTAINER && 
                            (struct.structureType !== STRUCTURE_RAMPART || 
                            !struct.my))
                            costs.set(struct.pos.x, struct.pos.y, 0xff);

                    });

                    // 避开房间内不是自己的 creep
                    room.find(FIND_CREEPS).forEach(function(creep) {
                        if (!creep.my) {
                            // range attack 7 * 7
                            let xx = creep.pos.x - 3;
                            let yy = creep.pos.y - 3;
                            for (let x = 0; x < 7; x++) {
                                for (let y = 0; y < 7; y++) {
                                    let xxx = xx + x;
                                    let yyy = yy + x;
                                    if (xxx <= 0) xxx = 1;
                                    else if (xxx >= 60) xxx = 59;
                                    if (yyy <= 0) xxx = 1;
                                    else if (yyy >= 60) xxx = 59;

                                    costs.set(xxx, yyy, 0x1f);
                                }
                            }
                        }
                        else if (creep.my) {
                            costs.set(creep.pos.x, creep.pos.y, 0xff);
                        }
                    });
                }
                return costs;
            }
        });

        // 没有找到这样的路
        // console.log(road.path);
        if (road.path.length <= 0) return null;
        this.memory.farMove.paths = road.path;
    }
}