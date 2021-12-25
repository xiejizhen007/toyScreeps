// 小镇

import { CenterNetwork } from "structure/CenterNetwork";
import { LabNetwork } from "structure/LabNetwork/LabNetwork";
import { LinkNetwork } from "structure/LinkNetwork/LinkNetwork";
import { TransportNetwork } from "tasks/TransportNetwork";

// 每过一段时间检查当前的建筑工地
const TIME_TO_CHECK_CONSTRUCTION_SITE = 10000;

/**
 * 实际控制的房间，游戏运行的最大工作单位
 * MRoom => the room under my control
 */
export class MRoom {
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

    // module
    linkNetwork: LinkNetwork;
    labNetwork: LabNetwork;
    transportNetwork: TransportNetwork;
    centerNetwork: CenterNetwork;

    constructor(roomName: string) {
        this.room = Game.rooms[roomName];
    }

    print(): string {
        return 'MRoom: ' + Game.shard.name + '/' + this.room.name;
    }

    refresh(): void {

    }

    register(): void {
        this.registerRoomObject();
        this.registerModule();
    }

    private registerRoomObject(): void {
        let startCpu = Game.cpu.getUsed();
        this.storage = this.room.storage;
        this.terminal = this.room.terminal;

        this.towers = _.filter(this.room.structures, f => f.structureType == STRUCTURE_TOWER) as StructureTower[];
        this.links = _.filter(this.room.structures, f => f.structureType == STRUCTURE_LINK) as StructureLink[];
        this.labs = _.filter(this.room.structures, f => f.structureType == STRUCTURE_LAB) as StructureLab[];
        this.spawns = _.filter(this.room.structures, f => f.structureType == STRUCTURE_SPAWN) as StructureSpawn[];
        this.extensions = _.filter(this.room.structures, f => f.structureType == STRUCTURE_EXTENSION) as StructureExtension[];

        let endCpu = Game.cpu.getUsed();
        // console.log('cpu used: ' + (endCpu - startCpu));
    }

    private registerModule(): void {
        this.linkNetwork = new LinkNetwork(this);
        this.labNetwork = new LabNetwork(this);
        this.transportNetwork = new TransportNetwork();
        this.centerNetwork = new CenterNetwork(this);
    }

    init(): void {
        this.linkNetwork.init();
        // this.labNetwork.init();
        // this.transportNetwork.init();
        this.centerNetwork.init();
    }

    work(): void {
        this.linkNetwork.work();
    }
}