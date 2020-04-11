export interface Stats {
    discoveredPlanets: number
    exploredStars: number
    computingTime: number
}

export interface ExtendedStats extends Stats {
    volunteers: number
}