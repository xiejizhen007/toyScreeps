import { CREEP_STATE } from "setting";

export class Role {
    constructor(creep: Creep) {
        this.creep_ = creep;
    }

    /**
     * 干活接口
     */
    public work(): void {
        this.check();
        
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

    }

    /**
     * 获取资源阶段
     */
    protected source() {

    }

    /**
     * 主要目标
     */
    protected target() {

    }

    /**
     * 每时每刻都运行
     * 
     */
    protected check() {
        
    }

    protected creep_: Creep;
    creep: Creep;
}