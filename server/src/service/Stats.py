from constants.Data import Store
from constants.Planet import PlanetRanks, PlanetType
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
        self.dataset_dao = db.dataset_dao
        self.star_dao = db.star_dao
        self.plot_service = PlotService()
        self.file_service = FileService()
        self.planet_service = PlanetService()
        self.store_service = StoreService()

    def get_aggregated(self):
        result = self.get_all(with_index=False)
        return result[0] if len(result) > 0 else {}
        
    def get_plot_data(self):
        return self.store_service.get(Store.PLANET_PLOTS)

    def get_planet_ranks(self):
        return self.store_service.get(Store.PLANET_RANKS)

    def set_plot_data(self, value):
        return self.store_service.add(Store.PLANET_PLOTS, value)

    def update_planets(self):
        self.update_planet_plots()
        self.update_planet_ranks()

    def update_planet_plots(self):
        props = self.planet_service.get_properties_list(["mass", "type"], ["distance"], ["semi_major_axis"])
        sc, xmin1, xmax1, ymin1, ymax1 = self.plot_service.main_scatter(props["semi_major_axis"], props["mass"], return_range=True)
        self.file_service.save(sc, self.file_service.Type.STATS, "SmaxMass") 

        planet_types = PlanetType.values()
        hist, xmin2, xmax2, ymin2, ymax2 = self.plot_service.hist(props["type"], planet_types, color="#383", return_range=True)
        self.file_service.save(hist, self.file_service.Type.STATS, "TypeCount", self.file_service.ContentType.SVG)

        hist, xmin3, xmax3, ymin3, ymax3 = self.plot_service.hist(props["distance"], [0, 50, 200, 500, 2000, 10e10], return_range=True)
        self.file_service.save(hist, self.file_service.Type.STATS, "DistanceCount", self.file_service.ContentType.SVG)

        data_done = self.get_data_done()
        pie = self.plot_service.pie([100 - data_done, data_done], width=0.2)
        self.file_service.save(pie, self.file_service.Type.STATS, "Progress", self.file_service.ContentType.SVG)

        self.store_service.update(Store.PLANET_PLOTS, {
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
                "y": {"vals": [data_done, 100 - data_done]},
                "image": "Progress.svg"
            }
        })

    def add(self, **kwargs):
        updated = {}

        for prop in kwargs:
            updated["inc__" + prop] = kwargs[prop]

        self.dao.update({"date": time.day()}, updated, upsert=True, with_return=False)

    def get_data_done(self):
        result = self.dataset_dao.aggregate([
            {"$match": {"type": {"$in": ["TARGET_PIXEL"]}}},
            {"$group": {"_id": "", "n_items": {"$sum": {"$size": "$items"}}, "size": {"$sum": "$size"}}},
            {"$project": {"done": {"$subtract": [1, {"$divide": ["$n_items", "$size"]}]}}}
        ])

        return result[0]["done"] * 100 if len(result) > 0 else 100

    def update_planet_ranks(self):
        latest = self.get_planet_rank("$planets.properties.discovery.date")
        similar = self.get_planet_rank({"$map": {"input": "$planets.properties", "in": {"$subtract": [1, '$$this.diameter']}}}, "min", {"properties.type": {"$in": [PlanetType.EARTH.value, PlanetType.SUPEREARTH.value, PlanetType.MERCURY.value]}})
        nearest = self.get_planet_rank("$properties.distance")

        self.store_service.update(Store.PLANET_RANKS, {
            PlanetRanks.LATEST.value: latest,
            PlanetRanks.SIMILAR.value: similar,
            PlanetRanks.NEAREST.value: nearest
        })

    def get_planet_rank(self, name, operation="first", filter={}):
        return self.star_dao.aggregate([
            {"$unwind": "$planets"},
            {"$project": {"value": {f"${operation}": name}, "planets": 1, "distance": {"$first": "$properties.distance"}}},
            {"$replaceRoot": {"newRoot": {"$mergeObjects": ["$$ROOT", "$planets"]}}},
            {"$project": {"planets": 0}},
            {'$match': {'value': {'$gt': 0}, **filter}},
            {"$sort": {"value": 1}},
            {"$limit": 6}
        ])
