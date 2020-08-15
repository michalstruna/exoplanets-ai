import PlanetType from './Constants/PlanetType'
import SpectralClass from './Constants/SpectralClass'
import SpectralSubclass from './Constants/SpectralSubclass'
import LuminosityClass from './Constants/LuminosityClass'
import LuminositySubclass from './Constants/LuminositySubclass'

export interface PlanetProperties {
    name: string
    diameter?: number
    mass?: number
    orbitalPeriod?: number
    semiMajorAxis?: number
    orbitalVelocity?: number
    density?: number
    surface_temperature?: number
    type: PlanetType
}

export interface Planet {
    properties: PlanetProperties[]
}

export interface StarProperties {
    name: string
    mass?: number
    diameter?: number
    surface_temperature?: number
    luminosity?: number
    apparent_magnitude?: number
    absolute_magnitude?: number
    metallicity?: number
    type: {
        spectral_class?: SpectralClass
        spectral_subclass?: SpectralSubclass
        luminosity_class?: LuminosityClass
        luminosity_subclass?: LuminositySubclass
    }
    planets?: Planet[]
    distance?: number
}

export interface Star {
    properties: StarProperties[]
    planets: Planet[]
}

export type Dataset = {
    _id: string
    name: string
    fields: Record<string, string>
    items_getter?: string
    item_getter?: string
    type: string
    total_size: number
    current_size: number
    processed: number
}

export type SegmentData<T> = {
    items: T[]
    count: number
}