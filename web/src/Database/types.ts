import PlanetType from './Constants/PlanetType'
import StarType from './Constants/StarType'
import SpectralType from './Constants/SpectralType'

export interface Planet {
    diameter?: number
    mass?: number
    orbitalPeriod?: number
    semiMajorAxis?: number
    orbitalVelocity?: number
    density?: number
    surfaceTemperature?: number
    type?: PlanetType
}

export interface Star {
    name: string
    mass?: number
    diameter?: number
    temperature?: number
    luminosity?: number
    absoluteMagnitude?: number
    spectralClass?: SpectralType
    planets?: Planet[]
    type?: StarType
    distance?: number
}

export type Dataset = {
    _id: string
    name: string
    fields: Record<string, string>
    items_getter?: string
    type: string
    total_size: number
    current_size: number
}

export type SegmentData<T> = {
    items: T[]
    count: number
}