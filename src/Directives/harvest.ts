import { RoomNetwork } from "Network/RoomNetwork";
import { Directive } from "./Directive";

export class DirectiveHarvest extends Directive {
    
    static directiveName = "harvest";
    static color = COLOR_YELLOW;
	static secondaryColor = COLOR_YELLOW;

    constructor(flag: Flag, roomNetwork: RoomNetwork) {
        super(flag, roomNetwork);
        // this.roomNetwork.flags.push(flag);
    }

    init(): void {
        
    }

    work(): void {
        
    }

    finish(): void {
        
    }
}