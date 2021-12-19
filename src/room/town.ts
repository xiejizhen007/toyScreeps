// 小镇

// 每过一段时间检查当前的建筑
const TIME_TO_CHECK_STRUCTURES = 10000;

/**
 * 实际控制的房间，游戏运行的最大工作单位
 * town => the room under my control
 */
export class Town {
    name: string;                                   // the town name
    room: Room;
    // 
    storage: StructureStorage | undefined;
    terminal: StructureTerminal | undefined;
    factory: StructureFactory | undefined;
    // base structure
    towers: StructureTower[];
    links: StructureLink[];
    extractor: StructureExtractor;
    labs: StructureLab[];
    powerSpawn: StructurePowerSpawn | undefined;
    observer: StructureObserver | undefined;
    nuker: StructureNuker | undefined;
    controller: StructureController;                // town controller

    // keep spawn
    spawns: StructureSpawn[];
    extensions: StructureExtension[];

    sources: Source[];                              // 
    tombstones: Tombstone[];                        // town 内的墓碑，为了之后取墓碑能量
    drops: { [resourceType: string]: Resource[]};   // town 内掉落的资源

    constructor(roomName: string) {
        this.room = Game.rooms[roomName];
    }

    print(): string {
        return 'town: ' + Game.shard.name + '/' + this.room.name;
    }

    /**
     * refresh the state of the town object
     */
    refresh(): void {

    }

    
}