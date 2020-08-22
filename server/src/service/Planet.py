from .Base import Service
import db


class PlanetService(Service):

    def __init__(self):
        super().__init__(db.star_dao)

    def add(self, star_id, planet, with_return=True):
        return self.dao.update_by_id(star_id, {
            "push__planets": planet
        })

    def complete_planet(self, star, planet_props):
        if planet_props["transit"]:
            if planet_props["transit"]["period"]:
                planet_props["orbital_period"] = planet_props["transit"]["period"]

        if not star["properties"] or not star["properties"][0]:  # TODO: Primary props.
            return planet_props

        star_props = star["properties"][0]


        return planet_props