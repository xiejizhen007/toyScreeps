import { errorMapper } from './modules/errorMapper'

import './Prototypes/Mount';

export const loop = errorMapper(() => {
    const room = Game.rooms['W3N7'];
    room.memory._cache = {};
});