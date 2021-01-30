import Store from '../Redux/Store'
import { ProcessData, addProcess, setProcesses, updateProcess, logProcess } from '../../Discovery'
import { Socket } from '../../Async'
import { addMessage, addOnlineUser, Identity, Message, OnlineUser, removeOnlineUser, setMessages, setOnlineUsers, updateOnlineUser } from '../../User'

export const init = (identity?: Identity) => {
    Socket.emit('web_connect')

    window.onbeforeunload = () => {
        Socket.emit('web_disconnect')
    }

    if (identity) {
        Socket.emit('web_auth', identity._id)
    }

    Socket.on('clients_update', (processes: ProcessData[]) => {
        Store.dispatch(setProcesses(processes))
    })

    Socket.on('client_connect', (process: ProcessData) => {
        Store.dispatch(addProcess(process))
    })

    Socket.on('update_client', (process: ProcessData) => {
        Store.dispatch(updateProcess([process.id, process]))
    })

    Socket.on('client_log', (log: any) => {
        Store.dispatch(logProcess([log.client_id, log]))
    })



    /** ONLINE USERS */
    Socket.on('set_online_users', (users: OnlineUser[]) => {
        Store.dispatch(setOnlineUsers(users))
    })

    Socket.on('add_online_user', (user: OnlineUser) => {
        Store.dispatch(addOnlineUser(user))
    })

    Socket.on('remove_online_user', (userId: string) => {
        Store.dispatch(removeOnlineUser(userId))
    })

    Socket.on('update_online_user', (userId: string, user: OnlineUser) => {
        Store.dispatch(updateOnlineUser([userId, user]))
    })

    Socket.on('set_messages', (messages: Message[]) => {
        Store.dispatch(setMessages(messages))
    })

    Socket.on('add_message', (message: Message) => {
        Store.dispatch(addMessage(message))
    })
    
}