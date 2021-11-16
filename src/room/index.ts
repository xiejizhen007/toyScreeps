import { assignPrototype } from "utils";
import creepController from "./creepController";
import RoomExtension from "./extension";

export default function () {
    assignPrototype(RoomExtension, creepController);
    assignPrototype(Room, RoomExtension);
}