import mountPowerCreep from './powerCreep'
import mountCreep from './creep'
import mountRoom from './room'

export default function () {
    mountPowerCreep();
    mountCreep();
    mountRoom();
}