import lightkurve as lk
import numpy as np
import math
import os
from tensorflow.keras.models import load_model


# TODO: Replace nan.

class LightCurveService:

    def download_tps(self, star_name):
        return [lk.search_targetpixelfile(star_name, mission="Kepler", quarter=1).download()]

    def get_tps_size(self, tps):
        size = 0

        for tp in tps:
            size += tp.flux.nbytes + tp.time.size

        return size

    def tps_to_lc(self, tps):
        lcs = []
        target = None

        for tp in tps:
            if target is None or target == tp.targetid:
                lcs.append(tp.to_lightcurve(aperture_mask=tp.pipeline_mask))
                target = tp.targetid

        return lk.LightCurveCollection(lcs).stitch().flatten(window_length=501).remove_outliers()

    def get_pd(self, lc):
        pd = lc.to_periodogram(method="bls", period=np.arange(0.5, 150, 0.1))  # TODO: 0.001
        med = np.median(pd.power)
        return pd, self.get_peaks(pd.power, around=int(pd.power.shape[0] / 20), minimum=med)

    def get_peaks(self, values, minimum=-math.inf, maximum=math.inf, around=1):
        peaks = []

        for i in range(0, values.shape[0]):
            before_around = values[max(0, i - around):i]
            after_around = values[i + 1:min(i + around + 1, values.shape[0] - 1)]
            before_max = np.max(before_around) if before_around.shape[0] > 0 else -math.inf
            after_max = np.max(after_around) if after_around.shape[0] > 0 else -math.inf

            if values[i] >= minimum and values[i] <= maximum and values[i] > before_max and values[i] >= after_max:
                peaks.append(i)

        return peaks

    def get_gv(self, lc, pdg, norm=False):
        per, t0 = pdg.period_at_max_power, pdg.transit_time_at_max_power
        folded = lc.fold(per, t0=t0)
        gv = folded.bin(n_bins=2001)

        if norm:
            gv = gv.normalize() - 1
            gv = (gv / np.abs(gv.flux.min())) * 2.0 + 1

        return gv

    def get_lv(self, lc, pdg, norm=False):
        per, t0, dur = pdg.period_at_max_power, pdg.transit_time_at_max_power, pdg.duration_at_max_power
        fractional_duration = dur / per
        folded = lc.fold(per, t0=t0)
        phase_mask = (folded.phase.value > -4 * fractional_duration) & (folded.phase.value < 4 * fractional_duration)
        lc_zoom = folded[phase_mask]
        lv = lc_zoom.bin(n_bins=201)

        if norm:
            lv = lv.normalize() - 1
            lv = (lv / np.abs(lv.flux.min())) * 2.0 + 1
            
        return lv

    def is_planet(self, gv, lv):
        model = load_model(os.path.join(os.path.dirname(__file__), "../data/transit.h5"))
        return model.predict([self._to_cnn(lv), self._to_cnn(gv)]) > 0.5

    def _to_cnn(self, lc):
        flux = lc.flux.reshape((*lc.flux.shape, 1))
        return np.array([flux])