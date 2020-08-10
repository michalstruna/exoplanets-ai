import lightkurve as lk
import numpy as np
import math


class LightCurveService:

    def download_tp(self, star_name):
        return lk.search_targetpixelfile(star_name, mission="Kepler", quarter=1).download()

    def get_tp_size(self, tp):
        return tp.flux.nbytes + tp.time.nbytes

    def tp_to_lc(self, tp):
        return tp.to_lightcurve()

    def norm_lc(self, lc):
        return lc.flatten().remove_outliers()

    def get_periods(self, lc):
        pd = lc.to_periodogram(method="bls", period=np.arange(0.5, 100, 0.0001))
        from datetime import datetime
        print("=== Before median", datetime.now())
        med = np.median(pd.power)
        print("=== After median", datetime.now())
        peaks = self.get_peaks(pd.power, around=int(pd.power.shape[0] / 20), minimum=med)

        for peak in peaks:
            print(f"PEAK {peak}, T = {pd.period[peak]}, POW = {pd.power[peak]}")

        return list(map(lambda peak: pd.period[peak], peaks))

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