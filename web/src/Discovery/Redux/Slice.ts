import { Redux } from '../../Data'
import { ProcessData, ProcessLog } from '../types'
import { Arrays } from '../../Native'

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
        removeProcess: plain<string>((state, action) => {
            state.processes = state.processes.filter(process => process.id !== action.payload)
        }),
        updateProcess: plain<[string, Partial<ProcessData>]>((state, action) => {
            state.processes = state.processes.map(process => process.id === action.payload[0] ? { ...process, ...action.payload[1] } : process)
        }),
        logProcess: plain<[string, ProcessLog]>((state, action) => {
            Arrays.update(state.processes, p => p.id === action.payload[0], process => ({
                ...process,
                logs: [action.payload[1], ...process.logs]
            }))
        })
    })
)

export default slice.reducer
export const { addProcess, removeProcess, setProcesses, updateProcess, logProcess } = slice.actions