from pymongo import UpdateOne
import math
import numbers

from constants.Database import SpectralClass, SpectralSubclass, LuminosityClass, LuminositySubclass
from .Base import Service
import db
from .Constellation import ConstellationService

spectral_temperatures = [50000, 30000, 11000, 7500, 6000, 5000, 3500, 3000]


class StarService(Service):

    def __init__(self):
        super().__init__(db.star_dao)
        self.constellation_service = ConstellationService()

    def get_sort(self, sort):
        if not sort:
            return []

        return [{"$sort": sort}]

    def get_filter_by_name(self, name):
        return {"$or": [{"properties.name": name}, {"light_curves.name": name}]}

    def get_by_name(self, name):
        return self.dao.get(self.get_filter_by_name(name))

    def get_dataset_names(self, star):
        result = set()

        for props in star["properties"]:
            result.add(props["dataset"])

        for lc in star["light_curves"]:
            result.add(lc["dataset"])

        for planet in star["planets"]:
            for props in planet["properties"]:
                result.add(props["dataset"])

        return list(result)

    def aggregate(self, operations, filter={}, limit=None, skip=None, sort=None, with_index=False):
        pipeline = [{"$unwind": "$planets"}, {"$match": filter}, *self.get_sort(sort), {"$limit": limit}, {"$skip": skip}]

        if sort:
            prop = list(sort.keys())[0]
            is_planet_sort = prop.startswith("planets.")
        else:
            is_planet_sort = False

        if is_planet_sort:
            pipeline += [
                {"$addFields": {"planets.star_id": "$_id", "planets.star_properties": "$properties"}},
                {"$group": {"_id": 1, "planets": {"$push": "$planets"}}},
                {"$unwind": {"path": "$planets", "includeArrayIndex": "planets.index"}},
                {"$addFields": {"planets.index": {"$add": ["$planets.index", 1]}, "properties": "$planets.star_properties", "_id": "$planets.star_id"}},
                {"$group": {"_id": "$_id", "properties": {"$first": "$planets.star_properties"}, "planets": {"$push": "$planets"}}},
                {"$project": {"planets.star_properties": 0, "planets.star_id": 0}},
                {"$sort": {"planets.index": 1}}
            ]

            result = self.dao.aggregate(pipeline, with_index=False)
        else:
            result = self.dao.aggregate(operations, filter, limit, skip, sort, with_index=with_index)

        return result

    def upsert_all_by_name(self, stars):
        operations = []

        for star in stars:
            star = self.dao.collection(properties=[star])
            star.validate()
            star = star.to_mongo()  # TODO: Remove?

            operations.append(UpdateOne(
                self.get_filter_by_name(star["properties"][0]["name"]),
                {"$push": {"properties": {"$each": star["properties"]}}},
                upsert=True
            ))

        return db.star_dao.collection._get_collection().bulk_write(operations, ordered=False)

    def complete_star(self, star, with_constellation=True):
        result = {**star}

        result["density"] = self.get_density(star)
        result["surface_gravity"] = self.get_surface_gravity(star)
        result["luminosity"] = self.get_luminosity(star)
        result["absolute_magnitude"] = self.get_absolute_magnitude(result)
        result["type"] = self.get_type(result)
        result["distance"] = result["distance"] if isinstance(result["distance"], numbers.Number) and result["distance"] > 0 else None  # Kepler dataset has some stars with distance = 0.
        result["life_zone"] = self.get_life_zone(result)

        if with_constellation:
            result["constellation"] = self.constellation_service.get_by_coords(result["ra"], result["dec"])

        return result

    def complete_stars(self, stars):
        result = []

        for star in stars:
            result.append(self.complete_star(star, with_constellation=False))

        self.constellation_service.set_constellations(result)
        return result

    def get_life_zone(self, star):
        if "luminosity" in star and star["luminosity"]:
            return {
                "min_radius": round(math.sqrt(star["luminosity"] / 1.1), 3),
                "max_radius": round(math.sqrt(star["luminosity"] / 0.53), 3)
            }

    def get_type(self, star):
        tmp = {**star}
        tmp["type"] = {}

        if "surface_temperature" in star and star["surface_temperature"] is not None:
            cls, subcls = self.get_spectral_class(star)
            tmp["type"]["spectral_class"] = cls
            tmp["type"]["spectral_subclass"] = subcls

            cls, subcls = self.get_luminosity_class(tmp)
            tmp["type"]["luminosity_class"] = cls
            tmp["type"]["luminosity_subclass"] = subcls

        return tmp["type"]

    def get_density(self, star):
        if star["mass"] and star["diameter"]:
            return 1410 * star["mass"] / star["diameter"] ** 3

    def get_surface_gravity(self, star):
        if star["mass"] and star["diameter"]:
            return 274 * star["mass"] / star["diameter"] ** 2

    def get_luminosity(self, star):
        if star["surface_temperature"] and star["diameter"]:
            return (star["diameter"] ** 2) * ((star["surface_temperature"] / 5780) ** 4)  # TODO: Constants.

    def get_spectral_class(self, star):
        teff = star["surface_temperature"]

        if teff <= spectral_temperatures[-1]:
            return SpectralClass.M.value, SpectralSubclass.NINE.value

        if teff >= spectral_temperatures[0]:
            return SpectralClass.O.value, SpectralSubclass.ZERO.value

        for i in range(len(spectral_temperatures)):
            if spectral_temperatures[i] <= teff:
                spectral_class = SpectralClass.values()[i - 1]
                class_min, class_max = spectral_temperatures[i], spectral_temperatures[i - 1]
                class_size = class_max - class_min
                rel_teff = teff - class_min
                spectral_subclass = str(9 - math.floor(10 * rel_teff / class_size))

                return spectral_class, spectral_subclass

    def get_luminosity_class(self, star):
        if not star["type"]:
            return None, None

        cls = star["type"]["spectral_class"]
        mag = star["absolute_magnitude"]

        if cls is None or mag is None:
            return None, None

        return LuminosityClass.III.value, LuminositySubclass.A.value  # TODO


    def get_absolute_magnitude(self, star):
        if "distance" in star and "apparent_magnitude" in star and star["distance"] and star["apparent_magnitude"]:
            return round(star["apparent_magnitude"] + 5 * (1 - math.log10(star["distance"])), 2)

    def delete_empty(self):
        self.dao.delete({"__raw__": {"$where": "this.properties.length == 0"}})

    def delete_selection(self, id, selection):
        star = self.get_by_id(id)
        self.check_selection(star, selection)

        for category in selection:
            def filter_delete(category_item):
                tmp = category_item["dataset"] not in selection[category]

                if not tmp:
                    db.dataset_dao.update({"name": category_item["dataset"]}, {"push__deleted_items": category_item["name"]})

                return tmp

            star[category] = list(filter(filter_delete, star[category]))

        result = self.update(id, self.to_updated(star))

        for prop in ["properties", "light_curves"]:  # If star is empty, delete whole object. TODO: self.delete_empty for single star?
            if prop in star and star[prop]:
                return result

        self.delete(id)

    def to_updated(self, star):
        for prop in ["_id", "index", "datasets"]:
            if prop in star:
                del star[prop]

        return star