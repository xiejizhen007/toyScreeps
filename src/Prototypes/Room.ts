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

Object.defineProperty(Room.prototype, 'spawns', {
    get() {
        if (!this._spawns) {
            this._spawns = _.filter(this.structures as Structure[], f => f.structureType == STRUCTURE_SPAWN);
        }
        return this._spawns;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'links', {
    get() {
        if (!this._links) {
            this._links = _.filter(this.structures as Structure[], f => f.structureType == STRUCTURE_LINK);
        }
        return this._links;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'factory', {
    get() {
        if (!this._factory) {
            this._factory = _.find(this.structures as Structure[], f => f.structureType == STRUCTURE_FACTORY);
        }
        return this._factory;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'constructionSites', {
    get() {
        if (!this._constructionSites) {
            this._constructionSites = this.find(FIND_CONSTRUCTION_SITES);
        }
        return this._constructionSites;
    },
    configurable: true,
});
