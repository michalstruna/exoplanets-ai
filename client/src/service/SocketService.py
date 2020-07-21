import socketio
import sys

from utils import time
from service.DeviceService import DeviceService

sio = socketio.Client()
sio.connect("http://localhost:5000")  # TODO: Config.

device = DeviceService()

sio.emit("client_connect", {
    "name": device.get_host(),
    "os": device.get_os(),
    "cpu": device.get_cpu(),
    "start": time.now(),
    "state": 3,
    "pause_start": None,
    "pause_total": 0
})

@sio.event
def connected():
    print("=== CONNECTED ===")


@sio.event
def resume():
    print("=== RESUME ===")


@sio.event
def pause():
    print("=== PAUSE ===")


@sio.event
def terminate():
    print("=== TERMINATE ===")
    sio.disconnect()
    sys.exit()


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