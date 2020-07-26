import io from 'socket.io-client'
import Config from '../Constants/Config'

export default io(Config.serverUrl)