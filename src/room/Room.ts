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
        // let startCpu = Game.cpu.getUsed();
        if (!this._creeps) {
            this._creeps = this.find(FIND_MY_CREEPS);
            // console.log('find');
        }
        // console.log('creeps use cpu: ' + (Game.cpu.getUsed() -  startCpu));
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
        if (!this._player) {
            this._player = _.filter(this.hostiles, (creep: Creep) => {
                return creep.owner.username != 'Invader'
                    && creep.owner.username != 'Source Keeper';
            });
        }
        return this._player;
    },
    configurable: true
});


// structure

Object.defineProperty(Room.prototype, 'structures', {
    get() {
        if (!this._allStructures) {
            this._allStructures = this.find(FIND_STRUCTURES);
        }
        return this._allStructures;
    },
    configurable: true,
});

// flag

Object.defineProperty(Room.prototype, 'flags', {
    get() {
        // let startCpu = Game.cpu.getUsed();
        if (!this._flags) {
            this._flags = this.find(FIND_FLAGS);
        }
        // console.log('flags use cpu: ' + (Game.cpu.getUsed() -  startCpu));
        return this._flags;
    },
    configurable: true
});