export class LabGroup {
    terminal: StructureTerminal;
    labs: StructureLab[];           // Room 内的所有 Lab
    reactionLabs: StructureLab[];   // 反应物 Lab
    productLabs: StructureLab[];    // 产物 Lab
    boostLabs: StructureLab[];      // 用来 boost 的 Lab

    // TODO: 添加传输任务

    // 反应阶段
    runReaction(): void {
        const [lab1, lab2] = this.reactionLabs;
        for (const lab of this.productLabs) {
            if (lab.cooldown == 0) {
                const result = lab.runReaction(lab1, lab2);
                if (result == OK) {

                } else {
                    console.log('error reaction for lab ' + lab.pos + ' result: ' + result);
                }
            }
        }
    }
}