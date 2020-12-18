import PlanetType from './Constants/PlanetType'
import SpectralClass from './Constants/SpectralClass'
import SpectralSubclass from './Constants/SpectralSubclass'
import LuminosityClass from './Constants/LuminosityClass'
import LuminositySubclass from './Constants/LuminositySubclass'
import LifeType from './Constants/LifeType'
import PlanetStatus from './Constants/PlanetStatus'

interface View {
    plot: string
    min_flux: number
    max_flux: number
}

export interface PlanetTransit {
    depth: number
    duration: number
    period: number
    local_view: View
    global_view: View
}

export interface PlanetProperties {
    name: string
    diameter?: number
    mass?: number
    orbital_period?: number
    semi_major_axis?: number
    orbital_velocity?: number
    eccentricity?: number
    density?: number
    surface_temperature?: number
    surface_gravity?: number
    type: PlanetType
    transit?: PlanetTransit
    dataset: string
    processed: boolean
    life_conditions?: LifeType
}

export interface PlanetData {
    properties: PlanetProperties[]
    status: PlanetStatus
}

export interface StarProperties {
    name: string
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
        luminosity_subclass?: LuminositySubclass
    }
    planets?: PlanetData[]
    distance?: number
    dataset: string
    age?: number
    dec?: number
    ra?: number
    constellation?: string
    life_zone?: LifeZone
}

export interface LightCurve {
    name: string
    plot: string
    min_time: number
    max_time: number
    min_flux: number
    max_flux: number
    n_observations: number
    n_days: number
    dataset: string
}

export interface LifeZone {
    min_radius?: number
    max_radius?: number
}

export interface StarData {
    properties: StarProperties[]
    light_curves: LightCurve[]
    planets: PlanetData[]
}

export interface StarDetailData extends StarData {
    datasets: Dataset[]
}

export type DatasetNew = {
    name: string
    fields: Record<string, string>
    items_getter?: string
    item_getter?: string
    type: string
}

export type Dataset = DatasetNew & {
    _id: string
    total_size: number
    current_size: number
    processed: number
}

export type SegmentData<T> = {
    items: T[]
    count: number
}

export type RefItem = Dataset