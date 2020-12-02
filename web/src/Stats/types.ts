export interface Stats {
    planets: number
    stars: number
    hours: number
    gib: number
    lcs: number
}

export interface ExtendedStats extends Stats {
    volunteers: number
}

export interface AggregatedStatsItem {
    value: number
    diff: number
}

export interface AggregatedStats {
    planets: AggregatedStatsItem
    volunteers: AggregatedStatsItem
    hours: AggregatedStatsItem
    stars: AggregatedStatsItem
    gibs: AggregatedStatsItem
    curves: AggregatedStatsItem
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
    progress: PlotStats
}