import Store from '../Redux/Store'
import { ProcessData, addProcess, setProcesses, updateProcess } from '../../Discovery'
import { Socket } from '../../Async'

export const init = () => {
    Socket.emit('web_connect', { name: 'Michal' })

    Socket.on('clients_update', (processes: ProcessData[]) => {
        Store.dispatch(setProcesses(processes))
    })

    Socket.on('client_connect', (process: ProcessData) => {
        Store.dispatch(addProcess(process))
    })

    Socket.on('update_client', (processId: string, process: ProcessData) => {
        Store.dispatch(updateProcess([processId, process]))
    })
}