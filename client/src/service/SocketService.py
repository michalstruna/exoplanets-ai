import socketio

sio = socketio.Client()
sio.connect("http://localhost:5000")

x = 5

print(444)

@sio.event
def connect():
    print(1111111111111)
    sio.emit("client_init")


@sio.event
def connected(identity):
    print(2222222222)
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