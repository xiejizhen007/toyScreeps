import { Mem } from "Mem";

global.registerClaimRoom = function(origin: string, target: string) {
    // Global.registerClaimRoom(origin, target);
    const roomNetwork = Kernel.roomNetworks[origin];
    if (roomNetwork) {
        roomNetwork.memory = Mem.wrap(roomNetwork.memory, 'colony', {
            origin: origin,
            target: target,
        });
    }
}

global.terminal_addRequest = function(room: string, resourceType: ResourceConstant, amount: number, input = true, buy = true) {
    Kernel.terminalNetwork.addRequest(room, resourceType, amount, input, buy);
}

global.terminal_rmRequest = function(room: string, resourceType: ResourceConstant) {
    Kernel.terminalNetwork.removeRequest(room, resourceType);
}

global._buy = function(room: string, resourceType: ResourceConstant, amount: number, fast: boolean = true) {
    return Kernel.market.buy(room, resourceType, amount, fast);
}

global._sell = function(room: string, resourceType: ResourceConstant, amount: number, fast: boolean = true) {
    return Kernel.market.sell(room, resourceType, amount, fast);
}

/**
 * 
 * @param room powerCreep 驻扎的房间
 * @param name powerCreep 的名字
 */
global.setPC = function(room: string, name: string) {
    if (Kernel.roomNetworks[room]) {
        Kernel.roomNetworks[room].pcTaskSystem.setPC(name);
    }
}