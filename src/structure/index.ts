import { assignPrototype } from "utils";
import TowerExtension from "./tower";

export default function() {
    assignPrototype(StructureTower, TowerExtension);
}