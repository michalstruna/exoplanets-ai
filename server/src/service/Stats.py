from utils import time
from .Base import Service
import db


class GlobalStatsService(Service):

    def __init__(self):
        super().__init__(db.global_stats_dao)
        self.plots_dao = db.plots_dao

    def get_aggregated(self):
        result = self.get_all(with_index=False)
        return result[0] if len(result) > 0 else {}
        
    def get_plot_data(self):
        return None

    def add(self, **kwargs):
        updated = {}

        for prop in kwargs:
            updated["inc__" + prop] = kwargs[prop]

        self.dao.update({"date": time.day()}, updated, upsert=True, with_return=False)

    