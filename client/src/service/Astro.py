import lightkurve as lk
import numpy as np
import os
from tensorflow.keras.models import load_model

class LcService:

    LV_SIZE = 201
    GV_SIZE = 2001
    MAX_PERIODS = {"MIN": 25, 25: 100, 100: 250, 250: 300, 300: 300, "MAX": 300}

    def download_tps(self, star_name, mission="Kepler", exptime="long"):
        try:
            return lk.search_targetpixelfile(star_name, mission=mission, exptime=exptime).download_all()
        except:
            return None

    def get_tps_size(self, tps):
        size = 0

        for tp in tps:
            size += tp.flux.nbytes + tp.time.size

        return size

    def tps_to_lc(self, tps):
        lcc = map(lambda tp: tp.to_lightcurve(aperture_mask=tp.pipeline_mask).flatten(window_length=101), tps)
        lcc = lk.LightCurveCollection(lcc)
        return lcc.stitch().remove_outliers(sigma_upper=3, sigma_lower=20)

    def get_pdg(self, lc, max_period, min_period=0.5, num=100000, exclude_periods=[]):
        period = np.linspace(min_period, max_period, num)

        for per in exclude_periods:
            minimum = min(per * 0.9, per - 1)
            maximum = max(per * 1.1, per + 1)
            period = period[~((period > minimum) & (period < maximum))]

        return lc.to_periodogram(method="bls", period=period, frequency_factor=500)

    def get_gv(self, lc, pdg, norm=False):
        return self._get_view(lc, pdg, LcService.GV_SIZE, norm)

    def get_lv(self, lc, pdg, norm=False):
        return self._get_view(lc, pdg, LcService.LV_SIZE, norm, pdg.period_at_max_power.value)

    def replace_nans(self, x):
        last = np.nanmedian(x) if np.isnan(x[0]) else x[0]
        delta_max = ((np.nanmax(x) - np.nanmin(x)) / 20)

        for i in range(len(x)):
            if np.isnan(x[i]):
                x[i] = last + delta_max * np.random.rand()
            else:
                last = x[i]

    def _get_view(self, lc, pdg, bins, return_norm, phase=None):
        folded = lc.fold(pdg.period_at_max_power, pdg.transit_time_at_max_power)

        if phase:
            fractional_duration =  pdg.duration_at_max_power / pdg.period_at_max_power
            phase_mask = (folded.phase.value > -phase * fractional_duration) & (folded.phase.value < phase * fractional_duration)
            folded = folded[phase_mask]

        view = folded.bin(bins=bins)
        self.replace_nans(view.flux.value)
        self.replace_nans(view.flux_err.value)
        view = lk.LightCurve(time=np.resize(view.time.value, bins), flux=np.resize(view.flux.value, bins), flux_err=np.resize(view.flux_err.value, bins))
        view = view.remove_nans()

        if return_norm:
            norm = view.copy()
            norm = norm.normalize() - 1
            norm = (norm / np.abs(norm.flux.min())) * 2.0 + 1
            return view, norm

        return view

    def is_planet(self, gv, lv):
        model = load_model(os.path.join(os.path.dirname(__file__), "../data/transit.h5"))
        return model.predict([self._to_cnn(lv), self._to_cnn(gv)]) > 0.5

    def _to_cnn(self, lc):
        flux = lc.flux.reshape((*lc.flux.shape, 1))
        return np.array([flux])

    def shorten(self, lc, days):
        return lc[lc.time - lc.time[0] < days].remove_nans()