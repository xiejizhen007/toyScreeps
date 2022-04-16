import { Role } from "Creeps/Role";
import { RoomNetwork } from "Network/RoomNetwork";

export abstract class Directive {
    static directiveName: string;           // 指令的类型，比如说 'harvest'
    static color: ColorConstant;
    static secondaryColor: ColorConstant;

    name: string;                   // flag name
    pos: RoomPosition;              // flag position
    room: Room | undefined;         // flag room
    memory: FlagMemory;             // flag memory

    roles: { [name: string]: Role };
    roomNetwork: RoomNetwork;

    constructor(flag: Flag, roomNetwork: RoomNetwork) {
        this.name = flag.name;
        this.pos = flag.pos;
        this.room = flag.room;
        this.memory = flag.memory;
        this.roles = {};
        this.roomNetwork = roomNetwork;

        Kernel.observer.registerDirective(this);
        Kernel.directives[flag.name] = this;
    }

    get flag() {
        return Game.flags[this.name];
    }

    remove() {
        delete Kernel.directives[this.name];
        delete Memory.flags[this.name];

        return this.flag.remove();
    }

    setColor(color: ColorConstant, secondaryColor?: ColorConstant) {
        return this.flag.setColor(color, secondaryColor);
    }

    setPosition(pos: RoomPosition) {
        return this.flag.setPosition(pos);
    }

    abstract init(): void;
    abstract work(): void;
    abstract finish(): void;

    static create(pos: RoomPosition) {
        let flagName = this.directiveName + Game.time.toString();
        if (Game.flags[flagName]) {
            return ERR_NAME_EXISTS;
        }

        const result = pos.createFlag(flagName, this.color, this.secondaryColor);
        if (result == flagName) {
            console.log("create flag: " + flagName + " in pos: " + pos);
        }

        return result;
    }
}