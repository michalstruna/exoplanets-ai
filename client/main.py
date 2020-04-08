#!/usr/bin/python3

from socketIO_client import SocketIO

io = SocketIO('localhost', 5000)
io.emit('client_init')
