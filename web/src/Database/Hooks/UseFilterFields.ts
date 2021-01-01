import React from 'react'

import { DatasetPriority, DatasetType, LifeType, useTable } from '..'
import { TextEnumValue, useStrings } from '../../Data'
import DbTable from '../Constants/DbTable'
import SpectralClass from '../Constants/SpectralClass'
import LuminosityClass from '../Constants/LuminosityClass'
import PlanetType from '../Constants/PlanetType'

export default (): TextEnumValue[] => {

    const table = useTable()
    const strings = useStrings()
    const { stars, planets, datasets } = strings

    return React.useMemo(() => {
        switch (table) {
            case DbTable.BODIES:
                return [
                    { text: stars.name, value: 'name', values: String },
                    { text: stars.spectral_class, value: 'spectral_class', values: Object.values(SpectralClass).map(value => ({ text: `${stars.colors[value]} (${value})`, value })) },
                    { text: stars.luminosity_class, value: 'luminosity_class', values: Object.values(LuminosityClass).map(value => ({ text: `${stars.sizes[value]} (${value})`, value })) },
                    { text: `${stars.diameter} [☉]`, value: 'diameter', values: Number },
                    { text: `${stars.mass} [☉]`, value: 'mass', values: Number },
                    { text: `${stars.density} [kg/m^3]`, value: 'density', values: Number },
                    { text: `${stars.surface_temperature} [K]`, value: 'surface_temperature', values: Number },
                    { text: `${stars.distance} [ly]`, value: 'distance', values: Number },
                    { text: `${stars.luminosity} [☉]`, value: 'luminosity', values: Number },
                    { text: stars.transit, value: 'transit_depth', values: Number }, // TODO: Test.
                    { text: stars.planets, value: 'planets', values: Number }, // TODO: Test.
                    { text: `${stars.surface_gravity} [km/s]`, value: 'surface_gravity', values: Number },
                    { text: stars.absolute_magnitude, value: 'absolute_magnitude', values: Number },
                    { text: stars.apparent_magnitude, value: 'apparent_magnitude', values: Number },
                    { text: stars.metallicity, value: 'metallicity', values: Number },
                    { text: stars.ra, value: 'ra', values: Number }, // TODO: Unit hours or degrees?
                    { text: stars.dec, value: 'dec', values: Number },
                    // TODO: Test planets.
                    { text: `${planets.name} (${planets.planet})`, value: 'planet_name', values: String },
                    { text: `${planets.type} (${planets.planet})`, value: 'planet_type', values: Object.values(PlanetType).map(value => ({ text: strings.planets.types[value], value })) },
                    { text: `${planets.diameter} (${planets.planet}) [⊕]`, value: 'planet_diameter', values: Number },
                    { text: `${planets.mass} (${planets.planet}) [⊕]`, value: 'planet_mass', values: Number },
                    { text: `${planets.density} (${planets.planet}) [kg/m^3]`, value: 'planet_density', values: Number },
                    { text: `${planets.surface_temperature} (${planets.planet}) [K]`, value: 'planet_surface_temperature', values: Number },
                    { text: `${planets.semi_major_axis} (${planets.planet}) [au]`, value: 'planet_semi_major_axis', values: Number },
                    { text: `${planets.orbital_period} (${planets.planet}) [d]`, value: 'planet_orbital_period', values: Number },
                    { text: `${planets.transit} (${planets.planet})`, value: 'planet_transit_depth', values: Number },
                    { text: `${planets.life_conditions} (${planets.planet})`, value: 'planet_life_conditions', values: Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditionsTypes[value], value })) },
                    { text: `${planets.surface_gravity} (${planets.planet}) [km/s]`, value: 'planet_surface_gravity', values: Number },
                    { text: `${planets.orbital_velocity} (${planets.planet}) [km/s]`, value: 'planet_orbital_velocity', values: Number }
                ]
            case DbTable.STARS:
                return [
                    { text: stars.name, value: 'name', values: String },
                    { text: stars.spectral_class, value: 'spectral_class', values: Object.values(SpectralClass).map(value => ({ text: `${stars.colors[value]} (${value})`, value })) },
                    { text: stars.luminosity_class, value: 'luminosity_class', values: Object.values(LuminosityClass).map(value => ({ text: `${stars.sizes[value]} (${value})`, value })) },
                    { text: `${stars.diameter} [☉]`, value: 'diameter', values: Number },
                    { text: `${stars.mass} [☉]`, value: 'mass', values: Number },
                    { text: `${stars.density} [kg/m^3]`, value: 'density', values: Number },
                    { text: `${stars.surface_temperature} [K]`, value: 'surface_temperature', values: Number },
                    { text: `${stars.distance} [ly]`, value: 'distance', values: Number },
                    { text: `${stars.luminosity} [☉]`, value: 'luminosity', values: Number },
                    { text: stars.transit, value: 'transit_depth', values: Number }, // TODO: Test.
                    { text: stars.planets, value: 'planets', values: Number }, // TODO: Test.
                    { text: `${stars.surface_gravity} [km/s]`, value: 'surface_gravity', values: Number },
                    { text: stars.absolute_magnitude, value: 'absolute_magnitude', values: Number },
                    { text: stars.apparent_magnitude, value: 'apparent_magnitude', values: Number },
                    { text: stars.metallicity, value: 'metallicity', values: Number },
                    { text: stars.ra, value: 'ra', values: Number }, // TODO: Unit hours or degrees?
                    { text: stars.dec, value: 'dec', values: Number },
                ]

            case DbTable.PLANETS:
                return [
                    { text: `${planets.name} (${planets.planet})`, value: 'planet_name', values: String },
                    { text: `${planets.type} (${planets.planet})`, value: 'planet_type', values: Object.values(PlanetType).map(value => ({ text: strings.planets.types[value], value })) },
                    { text: `${planets.diameter} (${planets.planet}) [⊕]`, value: 'planet_diameter', values: Number },
                    { text: `${planets.mass} (${planets.planet}) [⊕]`, value: 'planet_mass', values: Number },
                    { text: `${planets.density} (${planets.planet}) [kg/m^3]`, value: 'planet_density', values: Number },
                    { text: `${planets.surface_temperature} (${planets.planet}) [K]`, value: 'planet_surface_temperature', values: Number },
                    { text: `${planets.semi_major_axis} (${planets.planet}) [au]`, value: 'planet_semi_major_axis', values: Number },
                    { text: `${planets.orbital_period} (${planets.planet}) [d]`, value: 'planet_orbital_period', values: Number },
                    { text: `${planets.transit} (${planets.planet})`, value: 'planet_transit_depth', values: Number },
                    { text: `${planets.life_conditions} (${planets.planet})`, value: 'planet_life_conditions', values: Object.values(LifeType).map(value => ({ text: strings.planets.lifeConditionsTypes[value], value })) },
                    { text: `${stars.distance} [ly]`, value: 'distance', values: Number },
                    { text: `${planets.surface_gravity} (${planets.planet}) [km/s]`, value: 'planet_surface_gravity', values: Number },
                    { text: `${planets.orbital_velocity} (${planets.planet}) [km/s]`, value: 'planet_orbital_velocity', values: Number }
                ]

            case DbTable.DATASETS:
                return [
                    { text: datasets.name, value: 'name', values: String },
                    { text: datasets.type, value: 'type', values: Object.values(DatasetType).map(value => ({ text: strings.datasets.types[value], value })) },
                    { text: datasets.total_size, value: 'total_size', values: Number },
                    { text: `${datasets.processed} [B]`, value: 'processed', values: Number },
                    { text: `${datasets.time} [s]`, value: 'name', values: Number },
                    { text: datasets.created, value: 'created', values: Date },
                    { text: datasets.modified, value: 'modified', values: Date },
                    { text: datasets.priority, value: 'priority', values: Object.values(DatasetPriority).filter(value => typeof value === 'number').map(value => ({ text: strings.datasets.priorities[value], value })) },
                    { text: datasets.url, value: 'url', values: String },
                ]
        }

        return []
    }, [table, strings])

}