// 读取 memory

export class Mem {
    static wrap(memory: any, memName: string, opts: any = {}) {
        if (!memory[memName]) {
			memory[memName] = _.clone(opts);
		}

		_.defaults(memory[memName], opts);
		return memory[memName];
    }
}