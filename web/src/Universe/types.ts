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

export type IndexedFilter = {

}

export type IndexedSort = {
    column: number
    isAsc: boolean
    level: number
}

export type Filter = {

}

export type Sort = {

}

// TODO: Add Sort nad Filter.