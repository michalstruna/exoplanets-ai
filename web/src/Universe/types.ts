import PlanetType from './Constants/PlanetType'
import StarType from './Constants/StarType'
import SpectralType from './Constants/SpectralType'

export interface Planet {
    radius?: number
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
    radius?: number
    temperature?: number
    luminosity?: number
    absoluteMagnitude?: number
    color?: string
    spectralClass?: SpectralType
    planets?: Planet[]
    type?: StarType
}