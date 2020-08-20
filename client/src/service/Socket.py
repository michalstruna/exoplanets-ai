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
        """
        log(LogType.DOWNLOAD_TP, name=task["item"])
        lc_service = LightCurveService()
        print("=== Before download tps.")
        tp = lc_service.download_tp(task["item"])
        task["meta"]["size"] = lc_service.get_tp_size(tp)
        print("=== Before to_lc.")
        lc = lc_service.tp_to_lc(tp)
        norm_lc = lc_service.norm_lc(lc)
        print("=== Before pd.")
        periods = lc_service.get_periods(norm_lc)
        print(periods)
        """


        """
        for period in periods:
            print(f"=== Befo
            re period {period}")

        lc = lc_service.tpfs_to_lc(tps)
        periods = lc_service.get_periods()

        for period, power in periods:
            gv = lc_service.get_global_view(lc, period)
            lv = lc_service.get_local_view(lc, period)
            is_planet = lc_service.is_planet(gv, lv)

            if is_planet:
                pass
            else:
                pass
        """

        task["solution"] = {
            "planets": [
                {
                    "name": "Star I",
                    "type": "superearth",
                    "diameter": 1.12,
                    "mass": 1.27,
                    "density": 0.88,
                    "semi_major_axis": 0.15,
                    "orbital_velocity": 35,
                    "life_conditions": LiveType.IMPOSSIBLE.value,
                    "orbital_period": 47.5,
                    "surface_temperature": 15,
                    "surface_gravity": 11,
                    "transit": {
                        "period": 0.18,
                        "depth": 0.19,
                        "duration": 0.20
                    },
                    "dataset": "Kepler 11"
                }
            ],
            "light_curve": {
                "name": task["item"],
                "flux": list(np.random.randint(9980, 10020, 100) / 10000),
                "dataset": "Kepler 12"
            }
        }
        pass

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