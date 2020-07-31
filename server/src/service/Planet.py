from .Base import Service
import db


class PlanetService(Service):

    def __init__(self):
        super().__init__(db.planet_dao)