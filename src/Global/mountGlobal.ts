import { Global } from "./Global"

global.registerClaimRoom = function(origin: string, target: string) {
    Global.registerClaimRoom(origin, target);
}

global.terminal_addRequest = function(room: string, resourceType: ResourceConstant, amount: number, input = true) {
    Global.terminalResourceRequest(room, resourceType, amount, input);
}

global.terminal_rmRequest = function(room: string, resourceType: ResourceConstant) {
    Global.terminalNetwork.removeRequest(room, resourceType);
}


global.market_sell = function(room: string, resourceType: ResourceConstant, amount: number) {
    Global.marketSell(room, resourceType, amount);
}