from astropy.coordinates import SkyCoord, get_constellation
from astropy import units as u

from service.Base import Service


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
            if star["ra"] is not None and ["dec"] is not None:
                ra.append(star["ra"])
                dec.append(star["dec"])

        constellations = self.get_by_coords(ra, dec)

        i = 0

        for star in stars:
            if star["ra"] is not None and ["dec"] is not None:
                star["constellation"] = constellations[i]
                i += 1
