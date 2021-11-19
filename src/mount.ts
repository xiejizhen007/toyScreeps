import mountPowerCreep from './powerCreep'
import mountCreep from './creep'
import mountRoom from './room'
import mountStructure from './structure'

export default function () {
    mountPowerCreep();
    mountCreep();
    mountRoom();
    mountStructure();
}