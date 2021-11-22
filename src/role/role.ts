import { CREEP_STATE } from "setting";

export class Role {
    constructor(creep: Creep) {
        this.creep_ = creep;
    }

    /**
     * 干活接口
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

    /**
     * 准备阶段
     * 比如说前往工作地点
     */
    protected prepare() {
        this.creep_.say("prepare");
    }

    /**
     * 获取资源阶段
     */
    protected source() {
        this.creep_.say("source");
    }

    /**
     * 获得资源之后的逻辑
     */
    protected target() {
        this.creep_.say("target");
    }

    protected creep_: Creep;
}