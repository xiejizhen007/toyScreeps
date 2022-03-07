export class Mem {
	static wrap(memory: any, memName: string, defaults = {}, deep = false) {
		if (!memory[memName]) {
			memory[memName] = _.clone(defaults);
		}
		if (deep) {
			_.defaultsDeep(memory[memName], defaults);
		} else {
			_.defaults(memory[memName], defaults);
		}
		return memory[memName];
	}

	static get(memory: any, memName: string) {
		return memory[memName];
	}
}