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