import { Global } from "Global/Global";
import { Mem } from "Mem";
import { Colony } from "./Colony";
import { CommandCenter } from "./CommandCenter";
import { CreepController } from "./CreepController";
import { DefenceNetwork } from "./DefenceNetwork";
import { LabCluster } from "./LabCluster";
import { LinkNetwork } from "./LinkNetwork";
import { MineSite } from "./MineSite";
import { PowerCreepTaskQueue } from "./PowerCreepTaskQueue";
import { SourceNetwork } from "./SourceNetwork";
import { SpawnNetwork } from "./SpawnNetwork";
import { TransportNetwork } from "./TransportNetwork";
import { UpgradeSite } from "./UpgradeSite";

export class RoomNetwork {
    room: Room;
    memory: RoomNetworkMemory;

    spawns: StructureSpawn[];
    extensions: StructureExtension[];

    storage: StructureStorage;
    terminal: StructureTerminal;
    factory: StructureFactory;

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
    powerCreepTaskQueue: PowerCreepTaskQueue;
    labCluster: LabCluster;
    commandCenter: CommandCenter;

    // sourceNetworks: SourceNetwork[];
    sourceNetworks: {[name: Id<Source>]: SourceNetwork};
    mineSite: MineSite;

    colony: Colony;

    constructor(room: Room) {
        this.room = room;
        Global.roomNetworks[room.name] = this;

        // this.creepController = new CreepController(this);
        // this.defenceNetwork = new DefenceNetwork(this);
        // this.linkNetwork = new LinkNetwork(this);
        // this.spawnNetwork = new SpawnNetwork(this);
        // this.upgradeSite = new UpgradeSite(this, this.room.controller);
        // this.transportNetwork = new TransportNetwork();

        // this.sourceNetworks = {};
        // const sources = this.room.find(FIND_SOURCES);
        // _.forEach(sources, s => {
        //     let tmp = new SourceNetwork(this, s);
        //     // this.sourceNetworks.push(tmp);
        //     this.sourceNetworks[s.id] = tmp;
        // })
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
        this.spawns = this.room.spawns;
        // this.extensions = this.room.extensions;
        this.extensions = _.filter(this.room.structures, f => f.structureType == STRUCTURE_EXTENSION) as StructureExtension[];

        // console.log('roomNetwork ' + this.extensions.length);        

        this.storage = this.room.storage;
        this.terminal = this.room.terminal;
        this.factory = this.room.factory;

        this.links = this.room.links;
        this.towers = this.room.towers;
        this.labs = _.filter(this.room.structures, f => f.structureType == STRUCTURE_LAB) as StructureLab[];
        this.containers = _.filter(this.room.structures, f => f.structureType == STRUCTURE_CONTAINER) as StructureContainer[];
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
        this.powerCreepTaskQueue = new PowerCreepTaskQueue(this);
        
        if (this.storage) {
            this.commandCenter = new CommandCenter(this, this.storage);
        }

        if (this.room.controller && this.room.controller.level >= 6) {
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

        {
            // const memory = Mem.wrap(this.memory, 'colony');
            // if (memory) {
            //     this.colony = new Colony(this, memory.target);
            // }
            const memory = Mem.get(this.memory, 'colony');
            if (memory && memory.target) {
                this.colony = new Colony(this, memory.target);
            }
        }
    }
}