import { assignPrototype } from "utils";
import creepController from "./creepController";
import RoomExtension from "./extension";
import PowerCreepController from "./powerCreepController";
import RoomController from "./roomController";

export default function () {
    assignPrototype(RoomExtension, creepController);
    assignPrototype(RoomExtension, PowerCreepController);
    assignPrototype(RoomExtension, RoomController);
    assignPrototype(Room, RoomExtension);
}