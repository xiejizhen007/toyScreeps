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

global.terminal_addRequest = function(room: string, resourceType: ResourceConstant, amount: number, input = false) {
    // Global.terminalResourceRequest(room, resourceType, amount, input);
    Kernel.terminalNetwork.addRequest(room, resourceType, amount, input, false);
}

global.terminal_rmRequest = function(room: string, resourceType: ResourceConstant) {
    // Global.terminalNetwork.removeRequest(room, resourceType);
}


global.market_sell = function(room: string, resourceType: ResourceConstant, amount: number) {
    // Global.marketSell(room, resourceType, amount);
}