import lightkurve as lk
import numpy as np
import os
from tensorflow.keras.models import load_model

class LcService:

    PERIODS = (10, 50, 250)

    def download_tps(self, star_name, mission="Kepler", exptime="long"):
        return lk.search_targetpixelfile(star_name, mission="Kepler", exptime=exptime).download_all()

    def get_tps_size(self, tps):
        size = 0

        for tp in tps:
            size += tp.flux.nbytes + tp.time.size

        return size

    def tps_to_lc(self, tps):
        lcc = map(lambda tp: tp.to_lightcurve(aperture_mask=tp.pipeline_mask).flatten(window_length=201), tps)
        lcc = lk.LightCurveCollection(lcc)
        return lcc.stitch().remove_outliers(sigma_upper=3, sigma_lower=20)

    def get_pdg(self, lc, max_period, min_period=0.5, num=100000):
        return lc.to_periodogram(method="bls", period=np.linspace(min_period, max_period, num))

    def get_gv(self, lc, pdg, norm=False):
        return self._get_view(lc, pdg, 2001, norm)

    def get_lv(self, lc, pdg, norm=False):
        return self._get_view(lc, pdg, 201, norm, pdg.period_at_max_power.value)

    def _get_view(self, lc, pdg, bins, return_norm, phase=None):
        folded = lc.fold(pdg.period_at_max_power, pdg.transit_time_at_max_power)

        if phase:
            fractional_duration =  pdg.duration_at_max_power / pdg.period_at_max_power
            phase_mask = (folded.phase.value > -phase * fractional_duration) & (folded.phase.value < phase * fractional_duration)
            folded = folded[phase_mask]

        view = folded.bin(bins=bins)

        if np.isnan(view.flux.value).any():
            view.flux.value[np.isnan(view.flux.value)] = 0#np.nanmin(view.flux.value)

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