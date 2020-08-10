import PlanetType from './Constants/PlanetType'
import StarType from './Constants/StarType'
import SpectralType from './Constants/SpectralType'
import React from 'react'
import { Level } from '../Layout'

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
    absolute_magnitude?: number
    spectral_type?: SpectralType
    planets?: Planet[]
    type: StarType
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