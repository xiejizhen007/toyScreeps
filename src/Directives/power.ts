import { RoomNetwork } from "Network/RoomNetwork";
import { Directive } from "./Directive";

export class DirectivePower extends Directive {
    
    static directiveName = "power";
    static color = COLOR_RED;
	static secondaryColor = COLOR_YELLOW;

    constructor(flag: Flag) {
        super(flag);
    }

    init(): void {

    }

    work(): void {
        
    }

    finish(): void {
        
    }
}