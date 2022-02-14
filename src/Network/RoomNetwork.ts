import { CreepController } from "./CreepController";
import { DefenceNetwork } from "./DefenceNetwork";
import { LinkNetwork } from "./LinkNetwork";
import { SourceNetwork } from "./SourceNetwork";
import { SpawnNetwork } from "./SpawnNetwork";
import { TransportNetwork } from "./TransportNetwork";
import { UpgradeSite } from "./UpgradeSite";

export class RoomNetwork {
    room: Room;
    memory: RoomNetworkMemory;

    spawns: StructureSpawn[];
    links: StructureLink[];
    containers: StructureContainer[];

    constructionSites: ConstructionSite[];

    creepController: CreepController;
    defenceNetwork: DefenceNetwork;
    linkNetwork: LinkNetwork;
    spawnNetwork: SpawnNetwork;
    upgradeSite: UpgradeSite;
    transportNetwork: TransportNetwork;

    // sourceNetworks: SourceNetwork[];
    sourceNetworks: {[name: Id<Source>]: SourceNetwork};

    constructor(room: Room) {
        this.room = room;

        this.creepController = new CreepController(this);
        this.defenceNetwork = new DefenceNetwork(this);
        this.linkNetwork = new LinkNetwork(this);
        this.spawnNetwork = new SpawnNetwork(this);
        this.upgradeSite = new UpgradeSite(this, this.room.controller);
        this.transportNetwork = new TransportNetwork();

        this.sourceNetworks = {};
        const sources = this.room.find(FIND_SOURCES);
        _.forEach(sources, s => {
            let tmp = new SourceNetwork(this, s);
            // this.sourceNetworks.push(tmp);
            this.sourceNetworks[s.id] = tmp;
        })
    }

    init(): void {
        this.initMemory();
        this.registerObject();

        this.creepController.init();
        this.defenceNetwork.init();
        this.linkNetwork.init();
        this.spawnNetwork.init();
        this.upgradeSite.init();

        _.forEach(this.sourceNetworks, f => f.init());
    }

    work(): void {
        this.creepController.work();
        this.defenceNetwork.work();
        this.linkNetwork.work();
        this.spawnNetwork.work();
        this.upgradeSite.work();

        _.forEach(this.sourceNetworks, f => f.work());

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

    private registerObject(): void {
        this.spawns = this.room.spawns;
        this.links = this.room.links;
        this.constructionSites = this.room.constructionSites;
    }
}