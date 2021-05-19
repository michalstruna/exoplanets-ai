from service.Store import StoreService
from utils import time
from .Base import Service
import db


class GlobalStatsService(Service):

    def __init__(self):
        super().__init__(db.global_stats_dao)
        self.store_service = StoreService()

    def get_aggregated(self):
        result = self.get_all(with_index=False)
        return result[0] if len(result) > 0 else {}
        
    def get_plot_data(self):
        return self.store_service.get("planets_plots")

    def set_plot_data(self, value):
        return self.store_service.add("planets_plots", value)

    def add(self, **kwargs):
        updated = {}

        for prop in kwargs:
            updated["inc__" + prop] = kwargs[prop]

        self.dao.update({"date": time.day()}, updated, upsert=True, with_return=False)

    