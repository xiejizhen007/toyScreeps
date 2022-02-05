Object.defineProperty(Room.prototype, 'creeps', {
    get() {
        if (!this._creeps) {
            this._creeps = this.find(FIND_CREEPS);
        }
        return this._creeps;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'structures', {
    get() {
        if (!this._structures) {
            this._structures = this.find(FIND_STRUCTURES);
        }
        return this._structures;
    },
    configurable: true,
});