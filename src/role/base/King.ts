import { CenterNetwork } from "Network/RoomNetwork/CenterNetwork";
import { RoomNetwork } from "Network/RoomNetwork/RoomNetwork";

// 中央集群管理者
export class King {
    creep: Creep;
    roomNetwork: RoomNetwork;
    centerNetwork: CenterNetwork;

    constructor(roomNetwork: RoomNetwork, name: string) {
        this.creep = Game.creeps[name];
        this.roomNetwork = roomNetwork;
        this.centerNetwork = roomNetwork.centerNetwork;
    }

    init(): void {
        const flag = Game.flags[this.creep.memory.task.flagName];
        if (!flag) {
            return;
        }

        if (!this.creep.pos.isEqualTo(flag)) {
            this.creep.goTo(flag.pos);
        }
    }

    work(): void {
        const outTask = this.centerNetwork.transportNetwork.outputs[0];
        if (outTask) {
            const amount = _.min([this.creep.store.getFreeCapacity(), outTask.amount]);
            this.creep.withdraw(outTask.target as TransportNetworkTarget, outTask.reosurceType, amount);
            return;
        }

        const inTask = this.centerNetwork.transportNetwork.inputs[0];
        if (inTask) {
            const amount = _.min([this.creep.store[inTask.reosurceType], inTask.amount]);
            this.creep.transfer(inTask.target as TransportNetworkTarget, inTask.reosurceType, amount);
            return;
        }

        console.log('king no task');
    }
}