import { assignPrototype } from "utils";
import creepExtension from "./extension";

export default function () {
    assignPrototype(Creep, creepExtension);
}