Object.defineProperty(Room.prototype, 'creeps', {
    get() {
        if (!this._creeps) {
            this._creeps = this.find(FIND_CREEPS);
        }
        return this._creeps;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'myCreeps', {
    get() {
        if (!this._myCreeps) {
            this._myCreeps = this.find(FIND_MY_CREEPS);
        }
        return this._myCreeps;
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