import { assignPrototype } from "utils";
import PowerSpawnExtension from "./powerSpawn";
import TowerExtension from "./tower";

export default function() {
    assignPrototype(StructureTower, TowerExtension);
    assignPrototype(StructurePowerSpawn, PowerSpawnExtension);
}