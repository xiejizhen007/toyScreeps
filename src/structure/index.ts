import { assignPrototype } from "utils";
import PowerSpawnExtension from "./powerSpawn";
import TowerExtension from "./tower";
import SpawnExtension from "./spawn";
import LabExtension from "./lab";
import TerminalExtension from "./terminal/terminal";

export default function() {
    assignPrototype(StructureTower, TowerExtension);
    assignPrototype(StructurePowerSpawn, PowerSpawnExtension);
    assignPrototype(StructureSpawn, SpawnExtension);
    assignPrototype(StructureTerminal, TerminalExtension);
    assignPrototype(StructureLab, LabExtension);
}