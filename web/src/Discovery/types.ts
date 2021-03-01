import ProcessState from './Constants/ProcessState'

export type ProcessLog = {
    created: number
    type: string
    values: any[]
}

export type ProcessData = {
    id: string
    name: string
    os: string
    cpu: string
    start: number
    n_curves: number
    n_planets: number
    state: ProcessState
    pause_start?: number
    pause_total: number
    logs: ProcessLog[]
}