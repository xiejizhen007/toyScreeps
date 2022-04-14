import { Mem } from "Mem";
import { Colony } from "./Colony";
import { CommandCenter } from "./CommandCenter";
import { CreepController } from "./CreepController";
import { DefenceNetwork } from "./DefenceNetwork";
import { LabCluster } from "./LabCluster";
import { LinkNetwork } from "./LinkNetwork";
import { LogisticsNetwork } from "./LogisticsNetwork";
import { MineSite } from "./MineSite";
import { PCTaskSystem } from "./PCTaskSystem";
import { SourceNetwork } from "./SourceNetwork";
import { SpawnNetwork } from "./SpawnNetwork";
import { TaskLists } from "./TaskLists";
import { TransportNetwork } from "./TransportNetwork";
import { UpgradeSite } from "./UpgradeSite";

export class RoomNetwork {
    room: Room;         // 所在房间
    name: string;       // 房间名
    memory: RoomNetworkMemory;

    // 房间内的建筑
    structures: Structure[];
    spawns: StructureSpawn[];
    extensions: StructureExtension[];

    storage: StructureStorage;
    terminal: StructureTerminal;
    factory: StructureFactory;
    powerSpawn: StructurePowerSpawn;

    links: StructureLink[];
    labs: StructureLab[];
    towers: StructureTower[];
    containers: StructureContainer[];

    constructionSites: ConstructionSite[];

    creepController: CreepController;
    defenceNetwork: DefenceNetwork;
    linkNetwork: LinkNetwork;
    spawnNetwork: SpawnNetwork;
    upgradeSite: UpgradeSite;
    
    transportNetwork: TransportNetwork;             // queen
    transportNetworkForTransfer: TransportNetwork;  // transfer
    logisticsNetwork: LogisticsNetwork;
    labCluster: LabCluster;
    commandCenter: CommandCenter;

    pcTaskSystem: PCTaskSystem;

    taskLists: TaskLists;

    // sourceNetworks: SourceNetwork[];
    sourceNetworks: {[name: Id<Source>]: SourceNetwork};
    mineSite: MineSite;

    colony: Colony;

    constructor(room: Room) {
        this.room = room;
        this.name = room.name;
        Kernel.roomNetworks[room.name] = this;
    }

    init(): void {
        this.initMemory();
        this.registerObjects();
        this.registerModules();

        if (this.colony) {
            this.colony.init();
        }

        this.creepController.init();
        this.defenceNetwork.init();
        this.linkNetwork.init();
        this.spawnNetwork.init();
        this.upgradeSite.init();
        
        if (this.labCluster) {
            this.labCluster.init();
        }
        
        if (this.commandCenter) {
            this.commandCenter.init();
        }
        
        if (this.mineSite) {
            this.mineSite.init();
        }

        _.forEach(this.sourceNetworks, f => f.init());

        this.taskLists.refresh();
        this.pcTaskSystem.init();
    }

    work(): void {
        this.defenceNetwork.work();
        this.creepController.work();
        this.spawnNetwork.work();
        this.upgradeSite.work();

        if (this.labCluster) {
            this.labCluster.work();
        }
        
        if (this.commandCenter)
            this.commandCenter.work();

        if (this.mineSite) {
            this.mineSite.work();
        }


        if (this.colony) {
            this.colony.work();
        }

        _.forEach(this.sourceNetworks, f => f.work());

        this.linkNetwork.work();

        this.clearUselessMemory();

        this.logisticsNetwork.clearUselessJob();
        this.pcTaskSystem.work();
    }

    finish(): void {
        this.pcTaskSystem.finish();
    }

    private initMemory(): void {
        if (!Memory.roomNetworks) {
            Memory.roomNetworks = {};
        }

        if (Memory.roomNetworks[this.room.name]) {
            this.memory = Memory.roomNetworks[this.room.name];
            this.memory.room = this.room.name;
            
            if (!this.memory.myCreeps) {
                this.memory.myCreeps = [];
            }

            if (!this.memory.networks) {
                this.memory.networks = {};
                this.memory.networks.sources = {};
            }
        } else {
            Memory.roomNetworks[this.room.name] = {};
        }
    }

    private clearUselessMemory(): void {
        let myCreeps = [];
        for (const name of this.memory.myCreeps) {
            if (Game.creeps[name]) {
                myCreeps.push(name);
            }
        }

        this.memory.myCreeps = myCreeps;
    }

    private registerObjects(): void {
        this.structures = this.room.structures;

        // this.spawns = this.room.spawns;
        this.spawns = _.filter(this.structures, f => f.structureType == STRUCTURE_SPAWN) as StructureSpawn[];
        this.extensions = _.filter(this.structures, f => f.structureType == STRUCTURE_EXTENSION) as StructureExtension[];

        this.storage = this.room.storage;
        this.terminal = this.room.terminal;
        this.factory = this.room.factory;
        this.powerSpawn = _.find(this.structures, f => f.structureType == STRUCTURE_POWER_SPAWN) as StructurePowerSpawn;

        // this.links = this.room.links;
        // this.towers = this.room.towers;
        this.links = _.filter(this.structures, f => f.structureType == STRUCTURE_LINK) as StructureLink[];
        this.labs = _.filter(this.structures, f => f.structureType == STRUCTURE_LAB) as StructureLab[];
        this.containers = _.filter(this.structures, f => f.structureType == STRUCTURE_CONTAINER) as StructureContainer[];
        this.constructionSites = this.room.constructionSites;
    }

    private registerModules(): void {
        this.creepController = new CreepController(this);
        this.defenceNetwork = new DefenceNetwork(this);
        this.linkNetwork = new LinkNetwork(this);
        this.spawnNetwork = new SpawnNetwork(this);
        this.upgradeSite = new UpgradeSite(this, this.room.controller);
        this.transportNetwork = new TransportNetwork();
        this.transportNetworkForTransfer = new TransportNetwork();
        this.logisticsNetwork = new LogisticsNetwork(this);
        
        if (this.storage && this.storage.my) {
            this.commandCenter = new CommandCenter(this, this.storage);
        }

        if (this.room.controller.level >= 6) {
            this.labCluster = new LabCluster(this);
        }

        this.sourceNetworks = {};
        const sources = this.room.find(FIND_SOURCES);
        _.forEach(sources, s => {
            let tmp = new SourceNetwork(this, s);
            // this.sourceNetworks.push(tmp);
            this.sourceNetworks[s.id] = tmp;
        });

        const mineral = this.room.find(FIND_MINERALS)[0];
        if (mineral) {
            const extractor = mineral.pos.lookFor(LOOK_STRUCTURES).find(f => f.structureType == STRUCTURE_EXTRACTOR) as StructureExtractor;
            if (extractor) {
                this.mineSite = new MineSite(this, mineral, extractor);
            }
        }

        const colonyMem = Mem.get(this.memory, 'colony');
        if (colonyMem) {
            this.colony = new Colony(this, colonyMem.target);
        }

        this.taskLists = new TaskLists(this);
        this.pcTaskSystem = new PCTaskSystem(this);
    }
}