import ProcessState from './Constants/ProcessState'

export type ProcessLog = {
    created: number
    text: number
}

export type ProcessData = {
    id: string
    name: string
    os: string
    cpu: string
    start: number
    stars: number
    planets: number
    state: ProcessState
    pause_start?: number
    pause_total: number
    logs: ProcessLog[]
}