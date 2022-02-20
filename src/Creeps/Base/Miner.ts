import { Role } from "Creeps/Role";
import { MineSite } from "Network/MineSite";

export class Miner extends Role {
    mineSite: MineSite;
    mineral: Mineral;

    init(): void {
        this.mineSite = this.roomNetwork.mineSite;
        this.mineral = this.mineSite.mineral;
    }

    work(): void {
        if (this.mineral.mineralAmount > 0 && this.mineSite.container) {
            if (this.creep.pos.isEqualTo(this.mineSite.container) && this.mineSite.extractor.cooldown == 0) {
                this.creep.harvest(this.mineral);
            } else {
                this.creep.goto(this.mineSite.container.pos);
            }
        }        
    }
}