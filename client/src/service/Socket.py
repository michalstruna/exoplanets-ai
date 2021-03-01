import socketio
import sys
import numpy as np

from utils import time
from service.Device import DeviceService
from constants.Process import ProcessState, TaskType, LogType
from service.Astro import LightCurveService
from service.Plot import PlotService

sio = socketio.Client()

device = DeviceService()
plot = PlotService()
lc_service = LightCurveService()


def log(type, *values):
    sio.emit("client_log", {"type": type.value, "values": values, "created": time.now()})


def submit(task):
    sio.emit("client_submit_task", task)


@sio.event
def connected():
    log(LogType.CONNECT)


@sio.event
def run(task):
    # TODO: remove_outliers - upper lower
    print("=== RUN ===")

    if task["type"] == TaskType.TARGET_PIXEL.value:
        log(LogType.DOWNLOAD_TP, task["item"])
        tps = lc_service.download_tps(task["item"])
        log(LogType.BUILD_LC, task["item"])
        task["meta"]["size"] = lc_service.get_tps_size(tps)
        lc = lc_service.tps_to_lc(tps)
        original_lc = lc.copy()
        short_lc = lc[lc.time - lc.time[0] < 100].remove_nans()
        log(LogType.ANALYZE_LC, task["item"])

        transits = []

        for max_per in (10, 100, 300):
            pdg = lc.to_periodogram("bls", period=np.linspace(0.5, max_per, 10000))
            per, t0, dur, dep = pdg.period_at_max_power, pdg.transit_time_at_max_power, pdg.duration_at_max_power, pdg.depth_at_max_power
            mask = pdg.get_transit_mask(period=per, transit_time=t0, duration=dur)
            lc = lc[~mask]
            gv_norm = lc_service.get_gv(original_lc, pdg, norm=True)
            lv_norm = lc_service.get_lv(original_lc, pdg, norm=True)

            if lc_service.is_planet(gv_norm, lv_norm):
                log(LogType.PLANET_FOUND, task["item"], per)
                gv = lc_service.get_gv(original_lc, pdg)
                lv = lc_service.get_lv(original_lc, pdg)

                transits.append({
                    "period": per,
                    "depth": dep,
                    "duration": dur,
                    "local_view": {
                        "plot": plot.plot_lc(lv.time.value, lv.flux, size=15, alpha=0.7),
                        "min_flux": round(np.min(lv.flux), 4),
                        "max_flux": round(np.max(lv.flux), 4)
                    },
                    "global_view": {
                        "plot": plot.plot_lc(gv.time.value, gv.flux, size=15, alpha=0.7),
                        "min_flux": round(np.min(gv.flux), 4),
                        "max_flux": round(np.max(gv.flux), 4)
                    },
                })
            else:
                log(LogType.FALSE_POSITIVE, task["item"], per)

        task["solution"] = {
            "transits": transits,
            "light_curve": {
                "name": task["item"],
                "plot": plot.plot_lc(short_lc.time.value, short_lc.flux.value),
                "min_flux": np.round(np.min(short_lc.flux.value), 4),
                "max_flux": np.round(np.max(short_lc.flux.value), 4),
                "min_time": np.round(np.min(short_lc.time.value), 4),
                "max_time": np.round(np.max(short_lc.time.value), 4),
                "n_observations": len(lc.flux),
                "n_days": np.round(lc.time.value[-1] - lc.time.value[0]),
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

sio.connect("http://localhost:5000")  # TODO: Config.

sio.emit("client_connect", {
    "name": device.get_host(),
    "os": device.get_os(),
    "cpu": device.get_cpu(),
    "start": time.now(),
    "state": ProcessState.WAITING_FOR_RUN.value,
    "pause_start": time.now(),
    "pause_total": 0,
    "n_planets": 0,
    "n_curves": 0,
    "logs": []
})