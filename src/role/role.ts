import { CREEP_STATE } from "setting";

export class Role {
    constructor(creep: Creep) {
        this.creep_ = creep;
    }

    /**
     * 
     */
    public work(): void {
        if (this.creep_.spawning) { return; }

        switch (this.creep_.memory.state) {
            case CREEP_STATE.PREPARE:
                this.prepare();
                break;
            case CREEP_STATE.SOURCE:
                this.source();
                break;
            case CREEP_STATE.TARGET:
                this.target();
                break;
            default:
                this.creep_.memory.state = CREEP_STATE.PREPARE;
                break;
        }
    }

    public prepare() {
        this.creep_.say("prepare");
    }

    public source() {
        this.creep_.say("source");
    }

    public target() {
        this.creep_.say("target");
    }

    protected creep_: Creep;
}