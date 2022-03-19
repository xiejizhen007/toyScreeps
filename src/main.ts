import { _Kernel } from 'Global/Kernel';
import { errorMapper } from './modules/errorMapper'

import './Prototypes/Mount';
import './Global/mountGlobal'; 

export const loop = errorMapper(() => {
    global.Kernel = new _Kernel();

    Kernel.build();

    // Game loop
    Kernel.init();
    Kernel.work();


    console.log('loop');
});