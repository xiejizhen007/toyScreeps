import { assignPrototype } from "utils";
import creepController from "./creepController";
import RoomExtension from "./extension";
import PowerCreepController from "./powerCreepController";

export default function () {
    assignPrototype(RoomExtension, creepController);
    assignPrototype(RoomExtension, PowerCreepController);
    assignPrototype(Room, RoomExtension);
}