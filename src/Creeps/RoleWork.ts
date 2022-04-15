import { Role } from "./Role"

export abstract class RoleWork extends Role {
    abstract init(): void;
    abstract work(): void;
    abstract finish(): void;
}