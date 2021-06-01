import React from 'react'
import { camelCase } from 'change-case'

import { DatasetPriority, DatasetType, LifeType, useTable } from '..'
import { PossibleValues, Strings, TextEnumValue, useStrings } from '../../Data'
import DbTable from '../Constants/DbTable'
import SpectralClass from '../Constants/SpectralClass'
import LuminosityClass from '../Constants/LuminosityClass'
import PlanetType from '../Constants/PlanetType'

interface FieldsOptions {
    namePrefix?: string
    textSuffix?: string
}

const fields = (strings: Strings, fields: [string, PossibleValues, string?][], options?: FieldsOptions): TextEnumValue[] => (
    fields.map(([value, values, unit]) => ({ text: strings[camelCase(value)] + (options?.textSuffix || '') + (unit ? ` [${unit}]` : ''), value: (options?.namePrefix || '') + value, values  }))
)

const useFilterFields = (): TextEnumValue[] => {

    const table = useTable()
    const strings = useStrings()

    return React.useMemo(() => {
        switch (table) {
            case DbTable.BODIES:
                return [
                    ...fields(strings.stars, [
                        ['name', String],
                        ['spectral_class', Object.values(SpectralClass).map(value => ({ text: `${strings.stars.colors[value]} (${value})`, value }))],
                        ['luminosity_class', Object.values(LuminosityClass).map(value => ({ text: `${strings.stars.sizes[value]} (${value})`, value }))],
                        ['diameter', Number, '☉'],
                        ['mass', Number, '☉'],
                        ['density', Number, 'km/m^3'],
                        ['surface_temperature', Number, 'K'],
                        ['distance', Number, 'ly'],
                        ['luminosity', Number, '☉'],
                        ['transit_depth', Number],
                        ['strings.planets', Number],
                        ['surface_gravity', Number, 'm/s^2'],
                        ['absolute_magnitude', Number],
                        ['apparent_magnitude', Number],
                        ['metallicity', Number],
                        ['ra', Number],
                        ['dec', Number],
                    ]),
                    ...fields(strings.planets, [
                        ['name', String],
                        ['type', Object.values(PlanetType).map(value => ({ text: strings.planets.types[value], value }))],
                        ['diameter', Number, '⊕'],
                        ['mass', Number, '⊕'],
                        ['density', Number, 'km/m^3'],
                        ['surface_temperature', Number, '°C'],
                        ['semi_major_axis', Number, 'au'],
                        ['orbital_period', Number, 'd'],
                        ['transit_depth', Number],
                        ['life_conditions', Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditionsTypes[value], value }))],
                        ['surface_gravity', Number, 'm/s^2'],
                        ['orbital_velocity', Number, 'km/s'],
                    ], { namePrefix: 'planet_' })
                ]
            case DbTable.STARS:
                return fields(strings.stars, [
                    ['name', String],
                    ['spectral_class', Object.values(SpectralClass).map(value => ({ text: `${strings.stars.colors[value]} (${value})`, value }))],
                    ['luminosity_class', Object.values(LuminosityClass).map(value => ({ text: `${strings.stars.sizes[value]} (${value})`, value }))],
                    ['diameter', Number, '☉'],
                    ['mass', Number, '☉'],
                    ['density', Number, 'km/m^3'],
                    ['surface_temperature', Number, 'K'],
                    ['distance', Number, 'ly'],
                    ['luminosity', Number, '☉'],
                    ['transit_depth', Number],
                    ['strings.planets', Number],
                    ['surface_gravity', Number, 'm/s^2'],
                    ['absolute_magnitude', Number],
                    ['apparent_magnitude', Number],
                    ['metallicity', Number],
                    ['ra', Number],
                    ['dec', Number],
                ])
            case DbTable.PLANETS:
                return fields(strings.planets, [
                    ['name', String],
                    ['type', Object.values(PlanetType).map(value => ({ text: strings.planets.types[value], value }))],
                    ['diameter', Number, '⊕'],
                    ['mass', Number, '⊕'],
                    ['density', Number, 'km/m^3'],
                    ['surface_temperature', Number, '°C'],
                    ['semi_major_axis', Number, 'au'],
                    ['orbital_period', Number, 'd'],
                    ['transit_depth', Number],
                    ['life_conditions', Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditionsTypes[value], value }))],
                    ['surface_gravity', Number, 'm/s^2'],
                    ['orbital_velocity', Number, 'km/s'],
                    ['distance', Number, 'ly'],
                    ['ra', Number],
                    ['dec', Number],
                ])

            case DbTable.DATASETS:
                return fields(strings.datasets, [
                    ['name', String],
                    ['type', Object.values(DatasetType).map(value => ({ text: strings.datasets.types[value], value }))],
                    ['size', Number],
                    ['processed', Number, 'B'],
                    ['time', Number, 's'],
                    ['created', Number],
                    ['modified', Number],
                    ['priority', Object.values(DatasetPriority).filter(value => typeof value === 'number').map(value => ({ text: strings.datasets.priorities[value], value }))],
                    ['url', String]
                ])
            case DbTable.USERS:
                return fields(strings.users, [
                    ['name', String]
                ])
        }

        return []
    }, [table, strings])

}

export default useFilterFields