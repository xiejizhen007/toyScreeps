// room prototypes

// controller

Object.defineProperty(Room.prototype, 'my', {
    get() {
        return this.controller && this.controller.my;
    },
    configurable: true,
});

// creeps

Object.defineProperty(Room.prototype, 'creeps', {
    get() {
        if (!this._creeps) {
            this._creeps = this.find(FIND_MY_CREEPS);
        }
        return this._creeps;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'hostiles', {
    get() {
        if (!this._hostiles) {
            this._hostiles = this.find(FIND_HOSTILE_CREEPS);
        }
        return this._hostiles;
    },
    configurable: true,
});

Object.defineProperty(Room.prototype, 'invaders', {
    get() {
        if (!this._invaders) {
            this._invaders = _.filter(this.hostiles, (creep: Creep) => creep.owner.username == 'Invader');
        }
        return this._invaders;
    },
    configurable: true
});

Object.defineProperty(Room.prototype, 'sourceKeepers', {
    get() {
        if (!this._sourceKeepers) {
            this._sourceKeepers = _.filter(this.hostiles, (creep: Creep) => creep.owner.username == 'Source Keeper');
        }
        return this._sourceKeepers;
    },
    configurable: true
});

Object.defineProperty(Room.prototype, 'players', {
    get() {
        if (!this._players) {
            this._players = _.filter(this.hostiles, (creep: Creep) => {
                return creep.owner.username != 'Invader'
                    && creep.owner.username != 'Source Keeper';
            });
        }
        return this._players;
    },
    configurable: true
});


// structure

Object.defineProperty(Room.prototype, 'structures', {
    get() {
        // 只能说稀奇古怪，只有这个出问题
        const start = Game.cpu.getUsed();
        if (!this._allStructures || this._allStructures.length == 0) {
            this._allStructures = this.find(FIND_STRUCTURES);
        }
        return this._allStructures;
    },
    configurable: true,
});

// flag

Object.defineProperty(Room.prototype, 'flags', {
    get() {
        if (!this._flags) {
            this._flags = this.find(FIND_FLAGS);
        }
        return this._flags;
    },
    configurable: true
});