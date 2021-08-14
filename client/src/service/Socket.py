import socketio
import sys
import numpy as np

from utils import time
from service.Device import DeviceService
from constants.Process import ProcessState, TaskType, LogType
from service.Astro import LcService
from service.Plot import PlotService
from constants import Config

sio = socketio.Client()

device = DeviceService()
plot = PlotService()
lc_service = LcService()


def log(type, *values):
    sio.emit("client_log", {"type": type.value, "values": values, "created": time.now()})


def submit(task):
    sio.emit("client_submit_task", task)


@sio.event
def connected():
    log(LogType.CONNECT)


@sio.event
def run(task):
    print("=== RUN ===", task)
    if task["type"] == TaskType.TARGET_PIXEL.value:
        log(LogType.DOWNLOAD_TP, task["item"])
        tps = lc_service.download_tps(task["item"])

        if not tps:
            submit(task)
            return

        task["meta"]["size"] = lc_service.get_tps_size(tps)
        lc = lc_service.tps_to_lc(tps)
        original_lc = lc.copy()
        short_lc = lc_service.shorten(original_lc, 100)
        log(LogType.ANALYZE_LC, task["item"])

        transits, periods = [], []
        max_per, planet_found = LcService.MAX_PERIODS["MIN"], False

        while max_per < LcService.MAX_PERIODS["MAX"] or planet_found:
            pdg = lc_service.get_pdg(lc, max_per, exclude_periods=periods)
            per, t0, dur, dep = pdg.period_at_max_power, pdg.transit_time_at_max_power, pdg.duration_at_max_power, pdg.depth_at_max_power
            periods.append(per.value)
            gv, gv_norm = lc_service.get_gv(lc, pdg, True)
            lv, lv_norm = lc_service.get_lv(lc, pdg, True)
            planet_found = lc_service.is_planet(gv_norm, lv_norm)
            max_per = LcService.MAX_PERIODS[max_per]
            
            if planet_found:
                mask = pdg.get_transit_mask(period=per, transit_time=t0, duration=dur)
                lc = lc[~mask].remove_nans()
                log(LogType.PLANET_FOUND, round(per.value, 2))

                transits.append({
                    "period": per.value,
                    "depth": dep.value,
                    "duration": dur.value,
                    "local_view": {
                        "plot": plot.plot_lc(lv.time.value, lv.flux.value, size=15, alpha=0.7),
                        "min_flux": np.round(np.nanmin(lv.flux.value), 4),
                        "max_flux": np.round(np.nanmax(lv.flux.value), 4)
                    },
                    "global_view": {
                        "plot": plot.plot_lc(gv.time.value, gv.flux.value, size=15, alpha=0.7),
                        "min_flux": np.round(np.min(gv.flux.value), 4),
                        "max_flux": np.round(np.max(gv.flux.value), 4)
                    }
                })
            else:
                log(LogType.FALSE_POSITIVE, round(per.value, 2))

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

sio.connect(Config.SERVER_URL)

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
