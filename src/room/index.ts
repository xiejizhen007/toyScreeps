import { assignPrototype } from "utils";
import creepController from "./creepController";
import roomExtension from "./extension";

export default function () {
    assignPrototype(roomExtension, creepController);
    assignPrototype(Room, roomExtension);
}