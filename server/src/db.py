from mongoengine import *
from bson.objectid import ObjectId
import math

from constants.Database import *
from utils import time


class Dao:

    def __init__(self, collection, pipeline=[]):
        self.collection = collection
        self.pipeline = pipeline

    def get_by_id(self, id):
        return self.get({"_id": Dao.id(id)})

    def get_all(self, filter=[], sort=[], limit=math.inf, offset=0):
        return self.aggregate(self.pipeline, filter=filter, limit=limit, offset=offset, sort=sort)

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

        self.collection.objects(id=Dao.id(id)).update_one(**self.modified(item), full_result=True)

        if with_return:
            return self.get_by_id(id)  # TODO: Test.

    def update(self, filter, item, with_return=True):
        pass  # TODO

    def update_all(self):
        pass  # TODO

    def delete_by_id(self):
        return self.collection(_id=Dao.id(id)).delete()

    def delete(self):
        pass

    def delete_all(self):
        pass

    def aggregate(self, operations, filter={}, limit=None, offset=None, sort=None):
        pipeline = [*operations, {"$match": filter}]

        if sort:
            prop = list(sort.keys())[0]

            if sort[prop] == 1:
                pipeline.append({"$addFields": {"sort": {"$map": {"input": "$properties", "as": "properties", "in": {"$cond": {"if": {"$eq": [f"$${prop}", None]}, "then": {"$type": "maxKey"}, "else": f"$${prop}"}}}}}})
                pipeline.append({"$sort": {"sort": 1}})
            else:
                pipeline.append({"$sort": sort})

        if offset:
            pipeline.append({"$skip": offset})

        if limit:
            pipeline.append({"$limit": limit})

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


class LogDocument(Document):
    meta = {"allow_inheritance": True, "abstract": True}

    created = LongField(required=True)
    modified = LongField(required=True)


class DatasetField(EmbeddedDocument):
    name = StringField(required=True, max_length=50)
    prefix = StringField(max_length=50)
    multiple = FloatField()


class Dataset(LogDocument):
    name = StringField(max_length=50, required=True, unique=True)
    fields = MapField(EmbeddedDocumentField(DatasetField), required=True)
    item_getter = URLField(max_length=500, regex=".*{#}.*")
    items_getter = URLField(max_length=500)
    items = ListField(StringField(max_length=50, default=[], required=True))
    total_size = IntField(min_value=0, required=True)
    processed = LongField(min_value=0, default=0, required=True)
    type = StringField(max_length=50, required=True)
    time = LongField(min_value=0, default=0, required=True)
    priority = IntField(min_value=1, max_value=5, default=3, required=True)


dataset_dao = Dao(Dataset, [
    {"$addFields": {"current_size": {"$size": "$items"}}},
    {"$project": {"items": 0}}
])


class StarType(EmbeddedDocument):
    size = StringField(enum=StarSize.values(), null=True)
    spectral_class = StringField(enum=SpectralClass.values(), null=True)
    spectral_subclass = StringField(enum=SpectralSubclass.values(), null=True)
    luminosity_class = StringField(enum=LuminosityClass.values(), null=True)
    luminosity_subclass = StringField(enum=LuminositySubclass.values(), null=True)


class StarProperties(EmbeddedDocument):
    name = StringField(required=True, max_length=50, unique=True)
    diameter = FloatField(min_value=0, null=True)
    mass = FloatField(min_value=0, null=True)
    density = FloatField(min_value=0, null=True)
    surface_temperature = IntField(null=True)
    surface_gravity = FloatField(min_value=0, null=True)
    luminosity = FloatField(min_value=0, null=True)
    distance = FloatField(min_value=0, null=True)
    type = EmbeddedDocumentField(StarType, null=True)
    distance = FloatField(min_value=0, null=True)
    apparent_magnitude = FloatField(null=True)
    absolute_magnitude = FloatField(null=True)
    metallicity = FloatField()
    dataset = StringField(required=True)


class Transit(EmbeddedDocument):
    period = FloatField(min_value=0, required=True)
    duration = FloatField(min_value=0, required=True)
    depth = FloatField(min_value=0, max_value=1, required=True)


class PlanetProperties(EmbeddedDocument):
    name = StringField(required=True, max_length=50)#, unique=True)
    type = StringField(enum=PlanetType.values())
    diameter = FloatField(min_value=0)
    mass = FloatField(min_value=0)
    density = FloatField(min_value=0)
    semi_major_axis = FloatField(min_value=0)
    orbital_velocity = FloatField(min_value=0)
    orbital_period = FloatField(min_value=0)
    surface_temperature = FloatField(min_value=0)
    life_conditions = StringField()  # TODO: DB table LiveType?
    transit = EmbeddedDocumentField(Transit)
    dataset = ReferenceField(Dataset, required=True)  # TODO: Surface gravity.


class Planet(Document):
    properties = ListField(EmbeddedDocumentField(PlanetProperties, required=True), required=True, default=[])
    star = ReferenceField("Star", required=True)

    meta = {
        "indexes": ["properties.name"]
    }


planet_dao = Dao(Planet, [{"$addFields": {"datasets": {"$size": "$properties"}}}])


class LightCurve(EmbeddedDocument):
    dataset = ReferenceField(Dataset, required=True)
    planets = ListField(ReferenceField(Planet), required=True, default=[])


class Star(Document):
    properties = ListField(EmbeddedDocumentField(StarProperties), default=[])
    light_curve = ListField(EmbeddedDocumentField(LightCurve), default=[])
    planets = ListField(ReferenceField(Planet), default=[])

    meta = {
        "indexes": ["properties.name"]
    }


star_dao = Dao(Star, [
    {"$addFields": {"datasets": {"$add": [{"$size": "$properties"}]}}}
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
