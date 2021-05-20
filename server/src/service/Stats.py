from constants.Database import PlanetType
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
        sc, xmin1, xmax1, ymin1, ymax1 = self.plot_service.main_scatter(props["semi_major_axis"], props["mass"], return_range=True)
        self.file_service.save(sc, self.file_service.Type.STATS, "SmaxMass") 

        planet_types = PlanetType.values()
        hist, ymax2 = self.plot_service.hist(["mercury", "jupiter"], planet_types, color="#383", return_range=True)
        self.file_service.save(hist, self.file_service.Type.STATS, "TypeCount", self.file_service.ContentType.SVG)

        hist, ymax3 = self.plot_service.hist(props["distance"], [0, 50, 200, 500, 2000, 10e10], return_range=True)
        self.file_service.save(hist, self.file_service.Type.STATS, "DistanceCount", self.file_service.ContentType.SVG)

        pie = self.plot_service.pie([30, 70], width=0.2)
        self.file_service.save(pie, self.file_service.Type.STATS, "Progress", self.file_service.ContentType.SVG)

        self.store_service.update("planets_plots", {
            "smax_mass": {
                "x": {"min": xmin1, "max": xmax1, "log": xmax1 / xmin1 > 10e3},
                "y": {"min": ymin1, "max": ymax1, "log": ymax1 / ymin1 > 10e3},
                "image": "SmaxMass.png"
            },
            "type_count": {
                "x": {"ticks": planet_types},
                "y": {"min": 0, "max": ymax2},
                "image": "TypeCount.svg"
            },
            "distance_count": {
                "x": {"ticks": ["< 50", "50-200", "200-500", "500-2k", "> 2k"]},
                "y": {"min": 0, "max": ymax3},
                "image": "DistanceCount.svg"
            },
            "progress": {
                "y": {"vals": [30, 70]},
                "image": "Progress.svg"
            }
        })

    def add(self, **kwargs):
        updated = {}

        for prop in kwargs:
            updated["inc__" + prop] = kwargs[prop]

        self.dao.update({"date": time.day()}, updated, upsert=True, with_return=False)

