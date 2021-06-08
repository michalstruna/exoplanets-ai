from astropy.coordinates import SkyCoord, get_constellation
from astropy import units as u

from service.Base import Service
from utils.native import Dict


class ConstellationService(Service):

    def get_by_coords(self, ra, dec):
        if ra is None or dec is None:
            return None

        coord = SkyCoord(ra=ra * u.degree, dec=dec * u.degree)
        return get_constellation(coord)

    def set_constellations(self, stars):
        ra = []
        dec = []

        for star in stars:
            if Dict.is_set(star, "ra", "dec", zeros=True):
                ra.append(star["ra"])
                dec.append(star["dec"])

        constellations = self.get_by_coords(ra, dec)

        i = 0

        for star in stars:
            if Dict.is_set(star, "ra", "dec", zeros=True):
                star["constellation"] = constellations[i]
                i += 1
