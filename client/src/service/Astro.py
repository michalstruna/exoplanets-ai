import lightkurve as lk
import numpy as np
import math
import os
from tensorflow.keras.models import load_model


# TODO: Replace nan.


class LightCurveService:

    def download_tps(self, star_name):
        return lk.search_targetpixelfile(star_name, mission="Kepler").download_all()

    def get_tps_size(self, tps):
        size = 0

        for tp in tps:
            size += tp.flux.nbytes + tp.time.nbytes

        return size

    def tps_to_lc(self, tps):
        lcs = []
        target = None

        for tp in tps:
            if target is None or target == tp.targetid:
                lcs.append(tp.to_lightcurve(aperture_mask=tp.pipeline_mask))
                target = tp.targetid

        lc = lk.LightCurveCollection(lcs)
        return lc.stitch(corrector_func=lambda lc: lc.remove_outliers().flatten(window_length=401)).remove_outliers(20)

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

    def get_gv(self, lc, pd, peak):
        t0 = pd.transit_time[peak]
        period = pd.period[peak]

        folded = lc.fold(period, t0=t0)

        gv = folded.bin(bins=2001, method='median').normalize() - 1
        gv = (gv / np.abs(gv.flux.min())) * 2.0 + 1
        return gv

    def get_lv(self, lc, pd, peak):
        t0 = pd.transit_time[peak]
        period = pd.period[peak]
        duration = pd.duration[peak]

        fractional_duration = duration / period
        folded = lc.fold(period, t0=t0)

        phase_mask = (folded.phase > -4 * fractional_duration) & (folded.phase < 4.0 * fractional_duration)
        lc_zoom = folded[phase_mask]

        lv = lc_zoom.bin(bins=201, method='median').normalize() - 1
        lv = (lv / np.abs(lv.flux.min())) * 2.0 + 1
        return lv

    def is_planet(self, gv, lv):
        model = load_model(os.path.join(os.path.dirname(__file__), "../data/transit.h5"))
        return model.predict([self._to_cnn(lv), self._to_cnn(gv)]) > 0.5

    def _to_cnn(self, lc):
        flux = lc.flux.reshape((*lc.flux.shape, 1))
        return np.array([flux])