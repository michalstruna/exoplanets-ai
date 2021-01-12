from utils import time
from .Base import Service
import db


class GlobalStatsService(Service):

    def __init__(self):
        super().__init__(db.global_stats_dao)

    def get_aggregated(self):
        return self.get_all()[0]

    def add(self, **kwargs):
        updated = {}

        for prop in kwargs:
            updated["inc__stats__" + prop] = kwargs[prop]

        self.dao.update({"date": time.day()}, updated, upsert=True, with_return=False)
