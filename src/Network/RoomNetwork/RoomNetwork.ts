import { MMemory } from "Memory";
import { FactoryNetwork } from "Network/GlobalNetwork/FactoryNetwork";
import { GlobalNetwork } from "Network/GlobalNetwork/GlobalNetwork";
import { MarketNetwork } from "Network/GlobalNetwork/MarketNetwork";
import { TerminalNetwork } from "Network/GlobalNetwork/TerminalNetwork";
import { WarNetwork } from "Network/GlobalNetwork/WarNetwork";
import { BaseNetwork } from "./BaseNetwork/BaseNetwork";
import { MineralNetwork } from "./BaseNetwork/MineralNetwork";
import { SourceNetwork } from "./BaseNetwork/SourceNetwork";
import { SpawnNetwork } from "./BaseNetwork/SpawnNetwork";
import { TowerNetwork } from "./BaseNetwork/TowerNetwork";
import { UpgradeNetwork } from "./BaseNetwork/UpgradeNetwork";
import { CenterNetwork } from "./CenterNetwork";
import { LabNetwork } from "./LabNetwork";
import { LinkNetwork } from "./LinkNetwork";
import { TransportNetwork } from "./TransportNetwork";

export class RoomNetwork {
    name: string;
    room: Room;             // 由 room 实例化 RoomNetwork
    memory: any;

    controller: StructureController;
    level: number;

    spawns: StructureSpawn[];
    extensions: StructureExtension[];

    storage: StructureStorage;
    terminal: StructureTerminal;
    factory: StructureFactory;

    nuker: StructureNuker;
    observer: StructureObserver;
    powerSpawn: StructurePowerSpawn;

    links: StructureLink[];
    availableLinks: StructureLink[];
    labs: StructureLab[];
    towers: StructureTower[];

    sources: Source[];
    mineral: Mineral;
    extractor: StructureExtractor;

    tombstones: Tombstone[];
    drops: Resource[];
    ruins: Ruin[];

    // global network
    globalNetwork: GlobalNetwork;
    factoryNetwork: FactoryNetwork;
    marketNetwork: MarketNetwork;
    terminalNetwork: TerminalNetwork;
    warNetwork: WarNetwork;

    // room network
    linkNetwork: LinkNetwork;
    labNetwork: LabNetwork;
    centerNetwork: CenterNetwork;
    transportNetwork: TransportNetwork;

    // base network
    baseNetworks: BaseNetwork[];
    mineralNetwork: MineralNetwork;
    sourceNetwork: SourceNetwork[];
    spawnNetwork: SpawnNetwork;
    towerNetwork: TowerNetwork;
    upgradeNetwork: UpgradeNetwork;

    constructor(room: Room) {
        this.room = room;
        this.name = room.name;

        this.registerRoomObject();
        this.registerNetwork();
    }

    refrash(): void {
        this.memory = MMemory.wrap(Memory.roomNetwork, this.room.name, {}, true);
        this.room = Game.rooms[this.room.name];
        _.forEach(this.baseNetworks, baseNetwork => baseNetwork.refresh());
        this.linkNetwork.refrash();
        // this.labNetwork.ref
    }

    init(): void {
        _.forEach(this.baseNetworks, baseNetwork => baseNetwork.init());
        this.linkNetwork.init();
        
    }

    work(): void {
        _.forEach(this.baseNetworks, baseNetwork => baseNetwork.work());
        this.linkNetwork.work();
    }

    private registerRoomObject(): void {
        this.controller = this.room.controller!;
        this.level = this.room.controller ? this.room.controller.level : 0;

        this.spawns = _.filter(this.room.structures, f => f.structureType == STRUCTURE_SPAWN) as StructureSpawn[];
        this.extensions = _.filter(this.room.structures, f => f.structureType == STRUCTURE_EXTENSION) as StructureExtension[];

        this.storage = this.room.storage;
        this.terminal = this.room.terminal;
        this.factory = _.filter(this.room.structures, f => f.structureType == STRUCTURE_FACTORY)[0] as StructureFactory;

        this.nuker = _.filter(this.room.structures, f => f.structureType == STRUCTURE_NUKER)[0] as StructureNuker;
        this.observer = _.filter(this.room.structures, f => f.structureType == STRUCTURE_OBSERVER)[0] as StructureObserver;
        this.powerSpawn = _.filter(this.room.structures, f => f.structureType == STRUCTURE_POWER_SPAWN)[0] as StructurePowerSpawn;

        this.links = _.filter(this.room.structures, f => f.structureType == STRUCTURE_LINK) as StructureLink[];
        this.availableLinks = _.clone(this.links);
        this.labs = _.filter(this.room.structures, f => f.structureType == STRUCTURE_LAB) as StructureLab[];
        this.towers = _.filter(this.room.structures, f => f.structureType == STRUCTURE_TOWER) as StructureTower[];

        this.sources = this.room.find(FIND_SOURCES);
        this.mineral = this.room.find(FIND_MINERALS)[0];
        this.extractor = _.filter(this.room.structures, f => f.structureType == STRUCTURE_EXTRACTOR)[0] as StructureExtractor;
    }

    private registerNetwork(): void {
        // room network
        this.linkNetwork = new LinkNetwork(this);
        this.labNetwork = new LabNetwork(this);

        if (this.storage) {
            this.centerNetwork = new CenterNetwork(this, this.storage);
        }
        this.transportNetwork = new TransportNetwork();

        // base network
        this.baseNetworks = [];

        if (this.towers[0]) {
            this.towerNetwork = new TowerNetwork(this, this.towers[0]);
        }
        
        if (this.spawns[0]) {
            this.spawnNetwork = new SpawnNetwork(this, this.spawns[0]);
        }

        this.upgradeNetwork = new UpgradeNetwork(this, this.controller);
    }
}