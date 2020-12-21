from mongoengine import *
from bson.objectid import ObjectId

from constants.Database import *
from utils import time


class Dao:

    def __init__(self, collection, pipeline=[]):
        self.collection = collection
        self.pipeline = pipeline

    def get_by_id(self, id):
        return self.get({"_id": Dao.id(id)})

    def get_all(self, init_filter=None, filter=None, sort=None, limit=None, offset=0, with_index=True):
        return self.aggregate(self.pipeline, init_filter=init_filter, filter=filter, limit=limit, offset=offset, sort=sort, with_index=with_index)

    def get(self, filter):
        items = self.get_all(filter=filter, limit=1)

        if not items:
            raise DoesNotExist(f"Item {filter} was not found.")

        return items[0]

    def get_count(self, operations, filter={}):
        pipeline = [*operations, {"$match": filter}, {"$count": "count"}]  # TODO: Use self.aggregate.
        result = list(self.collection.objects.aggregate(pipeline, allowDiskUse=True))
        #result = self.aggregate(operations + [{"$count": "count"}], filter)
        return result[0]["count"] if result else 0

    def add(self, item, with_return=True):
        item = self.collection(**self.created(item)).save()

        if with_return:
            return self.get_by_id(item.to_mongo()["_id"])

    def add_all(self):
        pass  # TODO

    def update_by_id(self, id, item, with_return=True):
        if "_id" in item:
            del item["_id"]

        self.collection.objects(id=Dao.id(id)).update_one(**self.modified(item))

        if with_return:
            return self.get_by_id(id)  # TODO: Test.

    def update(self, filter, item, with_return=True, upsert=False):
        self.collection.objects(**filter).update_one(**self.modified(item), upsert=upsert)

        if with_return:
            return self.get(filter)

    def update_all(self):
        pass  # TODO

    def delete_by_id(self, id):
        return True

  #      return self.collection(id=id).delete()

    def delete(self):
        pass

    def delete_all(self):
        pass

    def aggregate(self, operations, filter=None, limit=None, offset=None, sort=None, with_index=True, init_filter=None):
        pipeline = []

        if init_filter:
            pipeline.append({"$match": init_filter})

        pipeline += operations

        if filter:
            pipeline.append({"$match": filter})

        if sort:
            pipeline.append({"$sort": sort})

        if offset:
            pipeline.append({"$skip": offset})

        if limit:
            pipeline.append({"$limit": limit})

        if with_index:
            pipeline += [
                {"$group": {"_id": 1, "items": {"$push": "$$ROOT"}}},
                {"$unwind": {"path": "$items", "includeArrayIndex": "items.index"}},
                {"$replaceRoot": {"newRoot": "$items"}},
                {"$addFields": {"index": {"$add": ["$index", (offset if offset else 0) + 1]}}}
            ]

        return list(self.collection.objects.aggregate(pipeline, allowDiskUse=True))

    @staticmethod
    def id(id):
        return ObjectId(id)

    def created(self, document):
        if issubclass(self.collection, LogDocument):
            document["created"] = time.now()

        return self.modified(document)

    def modified(self, document):
        if issubclass(self.collection, LogDocument):
            document["modified"] = time.now()

        return document


class BaseDocument(Document):
    meta = {"allow_inheritance": True, "abstract": True}

    #_id = ObjectIdField(primary_key=True)


class LogDocument(BaseDocument):
    meta = {"allow_inheritance": True, "abstract": True}

    created = LongField(required=True)
    modified = LongField(required=True)


class Dataset(LogDocument):
    name = StringField(max_length=50, required=True, unique=True)
    fields = MapField(StringField(), required=True)
    item_getter = StringField(max_length=500)
    items_getter = URLField(max_length=500)
    items = ListField(StringField(max_length=50, default=[], required=True))
    total_size = IntField(min_value=0, required=True)
    processed = LongField(min_value=0, default=0, required=True)
    type = StringField(max_length=50, required=True)
    time = LongField(min_value=0, default=0, required=True)
    priority = IntField(min_value=1, max_value=5, default=3, required=True)
    fields_meta = DictField()


dataset_dao = Dao(Dataset, [
    {"$addFields": {"current_size": {"$size": "$items"}}},
    {"$project": {"items": 0}}
])


class StarType(EmbeddedDocument):
    spectral_class = StringField(enum=SpectralClass.values())
    spectral_subclass = StringField(enum=SpectralSubclass.values())
    luminosity_class = StringField(enum=LuminosityClass.values())
    luminosity_subclass = StringField(enum=LuminositySubclass.values())


class LifeZone(EmbeddedDocument):
    min_radius = FloatField(min=0)
    max_radius = FloatField(min=0)


class StarProperties(EmbeddedDocument):
    name = StringField(required=True, max_length=50, unique=True, sparse=True)
    diameter = FloatField(min_value=0)
    mass = FloatField(min_value=0)
    density = FloatField(min_value=0)
    surface_temperature = IntField()
    surface_gravity = FloatField(min_value=0)
    luminosity = FloatField(min_value=0)
    distance = FloatField(min_value=0)
    type = EmbeddedDocumentField(StarType)
    apparent_magnitude = FloatField()
    absolute_magnitude = FloatField()
    metallicity = FloatField()
    dataset = StringField(required=True)
    constellation = StringField()

    life_zone = EmbeddedDocumentField(LifeZone)
    ra = FloatField()
    dec = FloatField()
    distance = FloatField(min_value=0)


class View(EmbeddedDocument):
    plot = StringField(required=True)
    min_flux = FloatField(required=True)
    max_flux = FloatField(required=True)


class Transit(EmbeddedDocument):
    period = FloatField(min_value=0, required=True)
    duration = FloatField(min_value=0, required=True)
    depth = FloatField(min_value=0, max_value=1, required=True)
    local_view = EmbeddedDocumentField(View, required=True)
    global_view = EmbeddedDocumentField(View, required=True)


class PlanetProperties(EmbeddedDocument):
    name = StringField(required=True, max_length=50)
    type = StringField(enum=PlanetType.values())
    diameter = FloatField(min_value=0)
    mass = FloatField(min_value=0)
    density = FloatField(min_value=0)
    semi_major_axis = FloatField(min_value=0)
    orbital_velocity = FloatField(min_value=0)
    orbital_period = FloatField(min_value=0)
    surface_gravity = FloatField(min_value=0)
    surface_temperature = FloatField(min_value=0)
    life_conditions = StringField(enum=LifeType.values())  # TODO: DB table LiveType?
    transit = EmbeddedDocumentField(Transit)
    dataset = ReferenceField(Dataset, required=True)  # TODO: Surface gravity.
    processed = BooleanField()


class Planet(EmbeddedDocument):
    _id = ObjectIdField(required=True, default=lambda: ObjectId())
    properties = ListField(EmbeddedDocumentField(PlanetProperties, required=True), required=True, default=[])
    status = StringField(required=True, enum=PlanetStatus.values())


planet_dao = Dao(Planet, [{"$addFields": {"datasets": {"$size": "$properties"}}}])


class LightCurve(EmbeddedDocument):
    name = StringField(required=True, max_length=50)
    dataset = ReferenceField(Dataset, required=True)
    plot = StringField(required=True)
    min_flux = FloatField(required=True)
    max_flux = FloatField(required=True)
    min_time = FloatField(required=True)
    max_time = FloatField(required=True)
    n_observations = FloatField(required=True)
    n_days = FloatField(required=True)


class Star(Document):
    properties = ListField(EmbeddedDocumentField(StarProperties), default=[])
    light_curves = ListField(EmbeddedDocumentField(LightCurve), default=[])
    planets = EmbeddedDocumentListField(Planet, default=[])

    meta = {
        "indexes": ["properties.name", "planets.properties.name", "light_curves.name"]
    }


star_dao = Dao(Star, [
    {"$addFields": {"datasets": {"$add": [{"$size": "$properties"}]}}}
])


class GlobalStatsItem(EmbeddedDocument):
    planets = IntField(required=True, default=0)
    volunteers = IntField(required=True, default=0)
    hours = FloatField(required=True, default=0)
    stars = IntField(required=True, default=0)
    gibs = FloatField(required=True, default=0)
    curves = IntField(required=True, default=0)


class GlobalStats(BaseDocument):
    date = StringField(required=True)
    stats = EmbeddedDocumentField(GlobalStatsItem, required=True)


global_stats_dao = Dao(GlobalStats, [
    {"$group": {
        "_id": 1,
        "planets": {"$sum": "$stats.planets"},
        "gibs": {"$sum": "$stats.gibs"},
        "volunteers": {"$sum": "$stats.volunteers"},
        "stars": {"$sum": "$stats.stars"},
        "curves": {"$sum": "$stats.curves"},
        "hours": {"$sum": "$stats.hours"}
    }}
])


class UserPersonal(EmbeddedDocument):
    is_male = BooleanField()
    country = StringField(max_length=10)
    birth = LongField()


class User(LogDocument):
    name = StringField(required=True, max_length=50)
    email = EmailField(max_length=200, unique=True, sparse=True)
    password = StringField(max_length=200)
    fb_id = StringField(max_length=200, unique=True, sparse=True)
    avatar = StringField(max_length=200)
    personal = EmbeddedDocumentField(UserPersonal, default={})


user_dao = Dao(User)


# TODO: Star aliases.
# TODO: map_units dataset?
# TODO: LocalDataset - upload file to DB.
# TODO: Radial velocity datasets.
# TODO: Star metalicity?
