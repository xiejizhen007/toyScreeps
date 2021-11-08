import { assignPrototype } from "utils";
import powerCreepExtension from "./mount.powerCreep";

export default function () {
    assignPrototype(PowerCreep, powerCreepExtension);
}