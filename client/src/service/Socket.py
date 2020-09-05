import socketio
import sys
import numpy as np

from utils import time
from service.Device import DeviceService
from constants.Process import ProcessState, TaskType, LogType
from service.Astro import LightCurveService
from constants.Universe import LiveType

sio = socketio.Client()
sio.connect("http://localhost:5000")  # TODO: Config.

device = DeviceService()


def log(type, **values):
    sio.emit("client_log", {"type": type.value, "values": values, "time": time.now()})


def submit(task):
    sio.emit("client_submit_task", task)


@sio.event
def connected():
    log(LogType.CONNECT)


@sio.event
def run(task):
    print("=== RUN ===")
    print(task)
    task["meta"]["size"] = 147521
    time.sleep(1000)

    if task["type"] == TaskType.TARGET_PIXEL.value:
        log(LogType.DOWNLOAD_TP, name=task["item"])
        lc_service = LightCurveService()
        print("=== Before download tps.")
        tps = lc_service.download_tps(task["item"])
        task["meta"]["size"] = lc_service.get_tps_size(tps)
        print("=== Before to_lc.")
        lc = lc_service.tps_to_lc(tps)
        print("=== Before pd.")
        pd, peaks = lc_service.get_pd(lc)

        transits = []

        for peak in peaks:
            gv = lc_service.get_gv(lc, pd, peak)
            lv = lc_service.get_lv(lc, pd, peak)

            if lc_service.is_planet(gv, lv):
                transits.append({
                    "period": pd.period[peak].value,
                    "depth": pd.depth[peak],
                    "duration": pd.duration[peak].value,
                    "flux": list(lv.flux)
                })

        task["solution"] = {
            "transits": transits,
            "light_curve": {
                "name": task["item"],
                "flux": list(lc.bin(bins=99).remove_outliers().flux),
                "dataset": "Kepler 12"
            }
        }

    submit(task)


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
    "pause_total": 0,
    "logs": []
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