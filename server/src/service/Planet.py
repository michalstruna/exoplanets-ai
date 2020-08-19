from .Base import Service
import db


class PlanetService(Service):

    def __init__(self):
        super().__init__(db.star_dao)

    def add(self, star_id, planet, with_return=True):
        return self.dao.update_by_id(star_id, {
            "push__planets": planet
        })