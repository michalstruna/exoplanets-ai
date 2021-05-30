import { Redux } from '../../Data'
import { ProcessData } from '../types'

const slice = Redux.slice(
    'discovery',
    {
        processes: Redux.empty<ProcessData[]>([])
    },
    ({ plain, set }) => ({
        addProcess: plain<ProcessData>((state, action) => {
            state.processes.unshift(action.payload)
        }),
        setProcesses: set<ProcessData[]>('processes'),
        updateProcess: plain<[string, Partial<ProcessData>]>((state, action) => {
            state.processes = state.processes.map(process => process.id === action.payload[0] ? { ...process, ...action.payload[1] } : process)
        })
    })
)

export default slice.reducer
export const { addProcess, setProcesses, updateProcess } = slice.actions