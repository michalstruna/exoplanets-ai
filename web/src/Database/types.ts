import PlanetType from './Constants/PlanetType'
import StarType from './Constants/StarType'
import SpectralType from './Constants/SpectralType'
import React from 'react'
import { Level } from '../Layout'

export interface PlanetProperties extends Record<any, any> {

}

export interface Planet {
    diameter?: number
    mass?: number
    orbitalPeriod?: number
    semiMajorAxis?: number
    orbitalVelocity?: number
    density?: number
    surfaceTemperature?: number
    type?: PlanetType
    properties: PlanetProperties[]
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