import { PC_TASK } from "setting";

import RoomExtension from "./extension";

export default class PowerCreepController extends RoomExtension {
    public powerWork(): boolean {
        if (!this.memory.powerTask) { this.memory.powerTask = []; }
        if (!this.usePower()) { return false; }

        // console.log('work');
        this.regenSource();
    }

    public usePower(): boolean {
        const controller = this.controller;
        return controller && controller.my && controller.isPowerEnabled;
    }

    public regenSource(): void {
        if (!this.memory.sources) { this.memory.sources = []; }

        if (this.memory.sources.length <= 0) {
            let sources = this.find(FIND_SOURCES);
            sources.forEach(s => this.memory.sources.push(s.id));
        }

        this.memory.sources.forEach(s => {
            const source = Game.getObjectById(s) as Source;
            if (!source) { return; }

            const newTask = {
                type: PC_TASK.REGEN_SOURCE,
                id: source.id,
            }

            if (source.effects && !source.effects.find(f => f.effect == PWR_REGEN_SOURCE)) {
                this.addPowerTask(newTask);
            }
        });
    }

    public hasPowerTask(task: pcTaskType): boolean {
        if (!this.memory.powerTask) { return false; }

        const find = this.memory.powerTask.find(f => f.type == task.type && f.id == task.id);
        return find ? true : false;
    }

    public addPowerTask(task: pcTaskType): boolean {
        if (!this.memory.powerTask) { this.memory.powerTask = []; }
        if (this.hasPowerTask(task)) { return false; }

        this.memory.powerTask.push(task);
        return true;
    }

    public removePowerTask(): boolean {
        if (!this.memory.powerTask) { return false; }
        return this.memory.powerTask.shift() ? true : false;
    }
}