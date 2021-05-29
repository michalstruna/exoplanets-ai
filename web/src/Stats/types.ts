import { RankedPlanetData } from "../Database/types"

export interface Stats {
    planets: number
    stars: number
    hours: number
    gib: number
    lcs: number
}

export interface StatsItem {
    value: number
    diff: number
}

export interface GlobalAggregatedStats {
    planets: StatsItem
    volunteers: StatsItem
    time: StatsItem
    stars: StatsItem
    data: StatsItem
    items: StatsItem
}

export interface AggregatedStats {
    planets: StatsItem
    time: StatsItem
    data: StatsItem
    items: StatsItem
}

export type StatsObject = {
    stats: AggregatedStats
}

export interface PlotAxis {
    min?: number
    max?: number
    log?: boolean
    ticks?: (number | string)[]
    vals?: number[]
}

export interface PlotStat {
    x: PlotAxis
    y: PlotAxis
    image: string
}

export interface PlotStats {
    smax_mass: PlotStat
    type_count: PlotStat
    distance_count: PlotStat
    progress: PlotStat
}

export type PlanetRanks = {
    nearest: RankedPlanetData[]
    latest: RankedPlanetData[]
    similar: RankedPlanetData[]
}