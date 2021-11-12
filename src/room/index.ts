import { assignPrototype } from "utils";
import roomExtension from "./extension";

export default function () {
    assignPrototype(Room, roomExtension);
}