import socketio

sio = socketio.Client()
sio.connect("http://localhost:5000")

@sio.event
def connect():
    sio.emit("client_init")


@sio.event
def connected(identity):
    print("CONNECTED", identity)


"""
@sio.event
def connect_error():
    print("CONNECT_ERROR")

@sio.event
def disconnect():
    print("DISCONNECT")

@sio.event
def authenticated(identity):
    print("identity")
"""