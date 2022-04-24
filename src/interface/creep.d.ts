interface Creep {

}

interface CreepMemory {
    role: string;
    belong: string;

    block?: boolean;    // 是否站定
    task?: TaskMemory;  // 执行的任务
}