import { RoomNetwork } from "./RoomNetwork";

const LabState = {
    Idle: 0,
    RequestMineral: 1,
    RequestEnergy: 2,
    LoadingLabs: 3,
    Reaction: 4,
    UnloadingLabs: 5,
}

export class LabNetwork {
    roomNetwork: RoomNetwork;
    terminal: StructureTerminal;
    labs: StructureLab[];
    reactionLabs: StructureLab[];
    productLabs: StructureLab[];

    memory: LabNetworkMemory;

    constructor(roomNetwork: RoomNetwork, terminal: StructureTerminal) {
        this.roomNetwork = roomNetwork;
        this.terminal = terminal;
        this.labs = roomNetwork.labs;
        // TODO: 从缓存中恢复底物与产物
    }

    private initLabState(): void {
        
    }
}