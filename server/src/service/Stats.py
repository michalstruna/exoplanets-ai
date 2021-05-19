from service.File import FileService
from service.Planet import PlanetService
from service.Plot import PlotService
from service.Store import StoreService
from utils import time
from .Base import Service
import db


class GlobalStatsService(Service):

    def __init__(self):
        super().__init__(db.global_stats_dao)
        self.plot_service = PlotService()
        self.file_service = FileService()
        self.planet_service = PlanetService()
        self.store_service = StoreService()

    def get_aggregated(self):
        result = self.get_all(with_index=False)
        return result[0] if len(result) > 0 else {}
        
    def get_plot_data(self):
        return self.store_service.get("planets_plots")

    def set_plot_data(self, value):
        return self.store_service.add("planets_plots", value)

    def update_planets(self):
        props = self.planet_service.get_properties_list(["mass", "semi_major_axis", "type"], ["distance"])
        sc = self.plot_service.main_scatter(props["semi_major_axis"], props["mass"])
        self.file_service.save(sc, self.file_service.Type.STATS, "SmaxMass") 

        #props["distance"] = [1, 12, 100, 1000, 10000]

        hist = self.plot_service.hist(props["distance"], [0, 50, 200, 500, 2000, 10e10])
        self.file_service.save(hist, self.file_service.Type.STATS, "DistanceCount", self.file_service.ContentType.SVG)

        hist = self.plot_service.hist(["mercury", "jupiter"], ["mercury", "earth", "super_earth", "neptune", "jupiter"], color="#383")
        self.file_service.save(hist, self.file_service.Type.STATS, "TypeCount", self.file_service.ContentType.SVG)

        self.store_service.update("planets_plots", {
            "smax_mass": {
                "x": {"min": 10e-3, "max": 10e4, "log": True},
                "y": {"min": 10e-2, "max": 10e5, "log": True},
                "image": "SmaxMass.png"
            },
            "type_count": {
                "x": {"ticks": ["mercury", "earth", "superearth", "neptune", "jupiter"]},
                "y": {"min": 0, "max": 10},
                "image": "TypeCount.svg"
            },
            "distance_count": {
                "x": {"ticks": ["< 50", "50-200", "200-500", "500-2k", "> 2k"]},
                "y": {"min": 0, "max": 10},
                "image": "DistanceCount.svg"
            },
            "progress": {
                "y": {"vals": [28.194567, 72.456]},
                "image": "Progress.svg"
            }
        })

    def add(self, **kwargs):
        updated = {}

        for prop in kwargs:
            updated["inc__" + prop] = kwargs[prop]

        self.dao.update({"date": time.day()}, updated, upsert=True, with_return=False)

    