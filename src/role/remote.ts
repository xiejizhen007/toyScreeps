import { Role } from "./role";

export class RemoteHarvester extends Role {
    public work() {
        super.work();
    }

    public override prepare() {
        this.creep_.say('remote');   
        // console.log('child prepare');
    }
}