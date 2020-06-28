#!/usr/bin/python3

import webbrowser


import socketio

sio = socketio.Client()
sio.connect("http://localhost:5000")

@sio.event
def connect_success():
    sio.emit("client_init")


@sio.event
def connect_error(error):
    print("The connection failed!", error)






#socket = SocketService()
#key = socket.init()
#webbrowser.open("https://exoplanets.now.sh/discovery")