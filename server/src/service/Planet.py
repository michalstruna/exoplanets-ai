from astropy import units as u
from astropy import constants as c
import math

from constants.Database import PlanetType, LifeType
from .Base import Service
import db


class PlanetService(Service):

    def __init__(self):
        super().__init__(db.star_dao)

    def add(self, star_id, planet, with_return=True):
        return self.dao.update_by_id(star_id, {
            "push__planets": planet
        })

    def complete_planet(self, st, pl):
        if pl["transit"]:
            if pl["transit"]["period"]:
                pl["orbital_period"] = pl["transit"]["period"]

        if not st["properties"] or not st["properties"][0]:  # TODO: Primary props.
            return pl

        st = st["properties"][0]  # TODO: Primary props.

        if pl["orbital_period"] and st["mass"]:
            pl["semi_major_axis"] = self.get_semi_major_axis(pl["orbital_period"], st["mass"])

        if pl["orbital_period"] and pl["semi_major_axis"]:
            pl["orbital_velocity"] = self.get_orbital_velocity(pl["orbital_period"], pl["semi_major_axis"])

        if st["diameter"] and pl["transit"]["depth"]:
            pl["diameter"] = self.get_radius(st["diameter"], pl["transit"]["depth"])

        if pl["diameter"]:
            pl["type"] = self.get_type(pl["diameter"])
            pl["mass"] = self.get_mass(pl["diameter"])

        if pl["diameter"] and pl["mass"]:
            pl["density"] = self.get_density(pl["diameter"], pl["mass"])
            pl["surface_gravity"] = self.get_surface_gravity(pl["diameter"], pl["mass"])

        if st["luminosity"] and pl["semi_major_axis"]:
            pl["surface_temperature"] = self.get_temperature(st["luminosity"], pl["semi_major_axis"])

        if st["life_zone"] and st["life_zone"]["max_radius"]:
            pass

        pl["life_conditions"] = self.get_life_conditions(st["life_zone"], pl["semi_major_axis"], pl["type"])

        return pl

    def get_semi_major_axis(self, orbper, st_mass):
        pl_per = orbper * u.day
        st_mass = st_mass * u.M_sun
        ax = ((pl_per ** 2 * c.G * st_mass) / (4 * math.pi ** 2)) ** (1 / 3)

        return ax.to(u.au).value

    def get_orbital_velocity(self, orbper, smax):
        orbper = orbper * u.day
        smax = smax * u.au

        o = (2 * math.pi * smax).to(u.au)
        v = (o / orbper)

        return v.to(u.km / u.s).value

    def get_radius(self, st_rad, flux_drop):
        st_rad = st_rad * u.R_sun
        r = (st_rad ** 2 * flux_drop) ** 0.5

        return r.to(u.R_earth).value

    def get_type(self, pl_rad):
        if pl_rad < 0.5:
            return PlanetType.MERCURY.value
        elif pl_rad < 1.2:
            return PlanetType.EARTH.value
        elif pl_rad < 2:
            return PlanetType.EARTH.value
        elif pl_rad < 5:
            return PlanetType.NEPTUNE.value
        else:
            return PlanetType.JUPITER.value

    def get_mass(self, pl_rad):
        if pl_rad < 6:
            return 0.9515 * pl_rad ** 3.1
        elif pl_rad < 10:
            return 1.7013 * pl_rad ** 2.0383
        else:
            return 0.6631 * pl_rad ** 2.4191

    def get_density(self, pl_rad, pl_mass):
        pl_rad = pl_rad * u.R_earth
        pl_mass = pl_mass * u.M_earth
        volume = 4 * math.pi * pl_rad ** 3 / 3
        density = pl_mass / volume

        return density.to(u.kg / u.m ** 3).value

    def get_surface_gravity(self, pl_rad, pl_mass):
        pl_rad = pl_rad * u.R_earth
        pl_mass = pl_mass * u.M_earth
        mass = c.G * pl_mass / pl_rad ** 2

        return mass.to(u.m / u.s ** 2).value

    def get_temperature(self, lum, smax, albedo=0.4):
        lum = lum * u.solLum
        smax = smax * u.au
        t = (lum * (1 - albedo) / (16 * math.pi * c.sigma_sb * smax ** 2)) ** 0.25

        return t.to(u.K).value - 273.15

    def get_life_conditions(self, life_zone, smax, pl_type):
        if not life_zone or not life_zone["max_radius"] or not smax or not pl_type:
            return LifeType.UNKNOWN.value

        if pl_type not in [PlanetType.MERCURY.value, PlanetType.EARTH.value, PlanetType.SUPER_EARTH.value]:
            return LifeType.IMPOSSIBLE.value

        if life_zone["max_radius"] < smax or life_zone["min_radius"] > smax:
            return LifeType.IMPOSSIBLE.value

        return LifeType.PROMISING.value

    def get_properties_list(self, props, star_props=[]):
        projection = {}
        result = {}

        for prop in props:
            projection[prop] = f"$planets.properties.{prop}"
            result[prop] = []

        for prop in star_props:
            projection[prop] = {"$first": f"$properties.{prop}"}
            result[prop] = []

        planets = self.dao.aggregate([
            {"$unwind": "$planets"},
            {"$unwind": "$planets.properties"},
            {"$project": projection}
            # TODO: Filter null?
        ])

        for planet in planets:
            for prop in [*props, *star_props]:
                if prop in planet:
                    result[prop].append(planet[prop])
            
        return result
