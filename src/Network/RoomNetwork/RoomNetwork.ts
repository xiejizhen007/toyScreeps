import { BaseNetwork } from "./BaseNetwork/BaseNetwork";
import { MiningNetwork } from "./BaseNetwork/MiningNetwork";
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

    linkNetwork: LinkNetwork;
    labNetwork: LabNetwork;
    centerNetwork: CenterNetwork;
    transportNetwork: TransportNetwork;

    // base network
    baseNetworks: BaseNetwork[];
    miningNetwork: MiningNetwork;
    sourceNetwork: SourceNetwork[];
    spawnNetwork: SpawnNetwork;
    towerNetwork: TowerNetwork;
    upgradeNetwork: UpgradeNetwork;

    constructor(room: Room) {
        this.room = room;
        this.name = room.name;
    }

    refrash(): void {

    }

    init(): void {
        _.forEach(this.baseNetworks, baseNetwork => baseNetwork.init());

    }

    work(): void {
        _.forEach(this.baseNetworks, baseNetwork => baseNetwork.work());
    }

    private registerRoomObject(): void {
        
    }
}