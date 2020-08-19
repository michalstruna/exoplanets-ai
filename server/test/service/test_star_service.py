import pytest

from constants.Database import SpectralClass as SC, SpectralSubclass as SS
from service.Star import StarService


@pytest.mark.parametrize(["teff", "spectral_class", "spectral_subclass"], [
    (60000, SC.O, SS.ZERO),
    (49500, SC.O, SS.ZERO),
    (48100, SC.O, SS.ZERO),
    (48000, SC.O, SS.ZERO),
    (41000, SC.O, SS.FOUR),
    (30000, SC.O, SS.NINE),
    (29500, SC.B, SS.ZERO),
    (13000, SC.B, SS.EIGHT),
    (11001, SC.B, SS.NINE),
    (11000, SC.B, SS.NINE),
    (10999, SC.A, SS.ZERO),
    (7500, SC.A, SS.NINE),
    (7499, SC.F, SS.ZERO),
    (6000, SC.F, SS.NINE),
    (5999, SC.G, SS.ZERO),
    (5000, SC.G, SS.NINE),
    (4999, SC.K, SS.ZERO),
    (3500, SC.K, SS.NINE),
    (3499, SC.M, SS.ZERO),
    (3000, SC.M, SS.NINE),
    (2000, SC.M, SS.NINE)
])
def test_spectral_type(teff, spectral_class, spectral_subclass):
    service = StarService()
    assert service.get_spectral_class(teff) == (spectral_class.value, spectral_subclass.value)
