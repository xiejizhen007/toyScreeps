import { Global } from "./Global"

global.registerClaimRoom = function(origin: string, target: string) {
    Global.registerClaimRoom(origin, target);
}