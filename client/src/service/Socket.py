import socketio
import sys

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
                    "diameter": 1.13,
                    "mass": 1.26,
                    "density": 0.85,
                    "semi_major_axis": 0.05,
                    "orbital_velocity": 25,
                    "live_conditions": LiveType.PROMISING.value,
                    "orbital_period": 0.877,
                    "surface_temperature": 168,
                    "transit": {
                        "period": 0.811,
                        "depth": 0.001,
                        "duration": 0.01
                    },
                    "dataset": 123456789
                }
            ]
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