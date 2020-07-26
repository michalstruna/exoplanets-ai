import socketio
import sys

from utils import time
from service.DeviceService import DeviceService
from constants.Process import ProcessState

sio = socketio.Client()
sio.connect("http://localhost:5000")  # TODO: Config.

device = DeviceService()


@sio.event
def connected():
    print("=== CONNECTED ===")


@sio.event
def run():
    print("=== RUN ===")


@sio.event
def pause():
    print("=== PAUSE ===")


@sio.event
def terminate():
    print("=== TERMINATE ===")
    sio.disconnect()
    sys.exit()



sio.emit("client_connect", {
    "name": device.get_host(),
    "os": device.get_os(),
    "cpu": device.get_cpu(),
    "start": time.now(),
    "state": ProcessState.WAITING_FOR_RUN.value,
    "pause_start": time.now(),
    "pause_total": 0
})


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