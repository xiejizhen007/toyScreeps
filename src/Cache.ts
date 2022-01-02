import { RoomNetwork } from "Network/RoomNetwork/RoomNetwork";

export class Cache {
    static wrap(memory: any, name: string, defaults = {}, deep = false): void {
        if (!memory[name]) {
            memory[name] = _.clone(defaults);
        }

        if (deep) {
            _.defaultsDeep(memory[name])
        } else {
            _.defaults(memory[name]);
        }

        return memory[name];
    }

    static set(): void {

    }
}