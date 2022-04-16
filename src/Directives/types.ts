import { DirectivePower } from "./power";

export function DirectiveType(flag: Flag) {
    switch (flag.memory.name) {
        case 'power':
            return new DirectivePower(flag);

        default:
            return null;
    }
}