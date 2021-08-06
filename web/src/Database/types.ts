import PlanetType from './Constants/PlanetType'
import SpectralClass from './Constants/SpectralClass'
import SpectralSubclass from './Constants/SpectralSubclass'
import LuminosityClass from './Constants/LuminosityClass'
import LifeType from './Constants/LifeType'
import PlanetStatus from './Constants/PlanetStatus'
import { LogObject } from '../Data'
import { StatsObject } from '../Stats'

interface View {
    plot: string
    min_flux: number
    max_flux: number
}

export interface Transit {
    depth: number
    duration: number
    period: number
    local_view: View
    global_view: View
}

export interface Orbit {
    period?: number
    inclination?: number
    eccentricity?: number
    semi_major_axis?: number
    velocity?: number
}

export interface PlanetProperties extends DatasetItem {
    diameter?: number
    distance?: number
    mass?: number
    density?: number
    surface_temperature?: number
    surface_gravity?: number
    type: PlanetType
    transit?: Transit
    processed: boolean
    life_conditions?: LifeType
    orbit: Orbit
}

export interface PlanetData {
    _id: string
    properties: PlanetProperties[]
    status: PlanetStatus
}

export interface RankedPlanetData extends PlanetData {
    value: number
}

export interface StarProperties extends DatasetItem {
    mass?: number
    diameter?: number
    density?: number
    surface_gravity?: number
    surface_temperature?: number
    luminosity?: number
    apparent_magnitude?: number
    absolute_magnitude?: number
    metallicity?: number
    type: {
        spectral_class?: SpectralClass
        spectral_subclass?: SpectralSubclass
        luminosity_class?: LuminosityClass
    }
    planets?: PlanetData[]
    distance?: number
    age?: number
    dec?: number
    ra?: number
    constellation?: string
    life_zone?: LifeZone
}

export interface LightCurveData extends DatasetItem {
    plot: string
    min_time: number
    max_time: number
    min_flux: number
    max_flux: number
    n_observations: number
    n_days: number
}

export interface Aliases extends DatasetItem {

}

export interface LifeZone {
    min_radius?: number
    max_radius?: number
}

export interface DatasetItem {
    name: string
    dataset: string
}

export interface StarData {
    _id: string
    properties: StarProperties[]
    light_curves: LightCurveData[]
    planets: PlanetData[]
    aliases: Aliases[]
}

export interface SystemData extends StarData {
    datasets: Dataset[]
}

export type DatasetUpdated = {
    name: string
    fields: Record<string, string>
    items_getter?: string
    item_getter?: string
    priority: number
}

export type DatasetNew = DatasetUpdated & {
    type: string
}

export type Dataset = LogObject & StatsObject & DatasetNew & {
    _id: string
    size: number
}

export type DatasetSelection<T> = Record<string, string[]>

export type Constellation = {
    name: string
    center: [number, number]
    shape: [number, number][][]
}