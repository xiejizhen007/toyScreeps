import { Role } from "Creeps/Role";
import { RoomNetwork } from "Network/RoomNetwork";

// 创建时的属性
export interface DirectiveCreationOptions {
    name?: string;      // flag 的名字
    room?: string;      // roomNetwork 的名字
}

// flag 的封装，拥有 flag 的属性与方法
export abstract class Directive {
    static directiveName: string;           // 指令的类型，比如说 'harvest'
    static color: ColorConstant;
    static secondaryColor: ColorConstant;

    name: string;                   // flag name
    pos: RoomPosition;              // flag position
    room: Room | undefined;         // flag room
    memory: FlagMemory;             // flag memory
    roomNetwork: RoomNetwork;

    roles: { [name: string]: Role };

    constructor(flag: Flag) {
        this.name = flag.name;
        this.pos = flag.pos;
        this.room = flag.room;
        this.memory = flag.memory;
        this.roles = {};

        if (flag.memory.room) {
            this.roomNetwork = Kernel.roomNetworks[flag.memory.room];
        } else {
            // 寻找一个合适的 roomNetwork，并在 memory 指向它
        }

        if (!this.roomNetwork) {
            // 没有合适的房间为该指令服务，删掉
            console.log('没有合适的房间为 flag: ' + flag.name + ' 服务');
            flag.remove();
            return;
        }

        Kernel.observer.registerDirective(this);
        Kernel.directives[this.name] = this;
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

    static create(pos: RoomPosition, opts: DirectiveCreationOptions = {}) {
        let flagName = this.directiveName + Game.time.toString();
        if (Game.flags[flagName]) {
            return ERR_NAME_EXISTS;
        }

        const result = pos.createFlag(flagName, this.color, this.secondaryColor);
        if (result == flagName) {
            console.log("create flag: " + flagName + " in pos: " + pos);
            Game.flags[flagName].memory.name = this.directiveName;
            Game.flags[flagName].memory.room = opts.room;
        }

        return result;
    }
}