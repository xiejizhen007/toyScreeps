// creep
Object.defineProperty(Room.prototype, 'creeps', {
    get() {
        if (!this._creeps) {
            this._creeps = this.find(FIND_MY_CREEPS);
        }
        return this._creeps;
    },
    configurable: true,
});

// Object.defineProperty(Room.prototype, 'myCreeps', {
//     get() {
//         if (!this._myCreeps) {
//             this._myCreeps = _.filter(this.creeps as Creep[], f => f.my);
//         }
//         return this._myCreeps;
//     },
//     configurable: true,
// });

Object.defineProperty(Room.prototype, 'enemies', {
    get() {
        if (!this._enemies) {
            // this._enemies = _.filter(this.creeps as Creep[], f => !f.my);
            this._enemies = this.find(FIND_HOSTILE_CREEPS);
        }
        return this._enemies;
    },
    configurable: true,
});

// strutcure
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

Object.defineProperty(Room.prototype, 'extensions', {
    get() {
        if (!this._extensions) {
            // console.log('ss');
            // console.log(this.strutcures);
            // this._extensions = _.filter(this.strutcures as Structure[], f => {
            //     console.log(f.structureType);
            //     return f.structureType == STRUCTURE_EXTENSION;
            // });
            this._extensions = _.filter(this.strutcures as Structure[], f => f.structureType == STRUCTURE_EXTENSION);
            // console.log(this.structures);
        }
        return this._extensions;
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

Object.defineProperty(Room.prototype, 'towers', {
    get() {
        if (!this._towers) {
            this._towers = _.filter(this.structures as Structure[], f => f.structureType == STRUCTURE_TOWER);
        }
        return this._towers;
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

// constructionSite
Object.defineProperty(Room.prototype, 'constructionSites', {
    get() {
        if (!this._constructionSites) {
            this._constructionSites = this.find(FIND_CONSTRUCTION_SITES);
        }
        return this._constructionSites;
    },
    configurable: true,
});
