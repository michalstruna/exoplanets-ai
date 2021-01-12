import { Numbers } from '../../Native'
import { UnitTypeData } from '../types'
import UnitType from '../Constants/UnitType'

/**
 * Format number with unit.
 * @param value Count of base units.
 * @param units List of pairs where each pair is [unitLabel, unitValue]. It must be sorted from min unit to max unit.
 */
export const format = (value: number, units: UnitTypeData = UnitType.SCALAR) => {
    for (let i = 0; i < units.length - 1; i++) {
        const [unitLabel, unitValue] = units[i]
        const [_, nextUnitValue] = units[i + 1]

        if (value < nextUnitValue) {
            return Numbers.format(value / unitValue) + unitLabel
        }
    }

    const [unitLabel, unitValue] = units[units.length - 1]
    return Numbers.format(value / unitValue) + unitLabel
}