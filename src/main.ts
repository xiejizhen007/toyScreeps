import { _Kernal } from 'Global/Kernal';
import { errorMapper } from './modules/errorMapper'

import './Prototypes/Mount';
import './Global/mountGlobal'; 

export const loop = errorMapper(() => {
    global.Kernal = new _Kernal();

    Kernal.build();

    // Game loop
    Kernal.init();
    Kernal.work();


    console.log('loop');
});