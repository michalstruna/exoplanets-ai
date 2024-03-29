from mongoengine.fields import *
from mongoengine.errors import DoesNotExist, ValidationError
from mongoengine.base import ObjectIdField
from mongoengine.document import Document, EmbeddedDocument
from bson.objectid import ObjectId

from constants.Star import *
from constants.Planet import *
from constants.User import UserRole, Sex
from utils import time
from service.Security import SecurityService
from service.File import FileService
from constants.Message import MessageTag

security_service = SecurityService()
file_service = FileService()

stats_fields = ("data", "items", "planets", "time")
global_stats_fields = (*stats_fields, "volunteers", "stars")


def aggregate_stats_pipeline(field="", days=7):
    global_stats = field == ""
    before = time.day(-days)
    result = []

    path = f"" if global_stats else field + "."
    target = f"" if global_stats else ".stats"
    fields = global_stats_fields if global_stats else stats_fields

    if not global_stats:
        result.append({"$unwind": {"path": f"$" + path[:-1], "preserveNullAndEmptyArrays": True}})

    group, add = {"_id": None if global_stats else "$_id", "root": {"$first": "$$ROOT"}}, {}

    for field in fields:
        group[f"stats_{field}"] = {"$sum": f"${path}{field}"}
        group[f"stats_{field}_diff"] = {"$sum": {"$cond": [{"$gt": [f"${path}date", before]}, f"${path}{field}", 0]}}

    for field in fields:
        add[field] = {"value": f"$stats_{field}", "diff": f"$stats_{field}_diff"}

    result.append({"$group": group})
    result.append({"$addFields": {f"root{target}": add}})

    result.append({"$replaceRoot": {"newRoot": "$root", }})
    result.append({"$project": {f"{path}date": 0}})
    result.append({"$sort": {"_id": 1}})

    return result


class Dao:

    def __init__(self, collection, pipeline=[]):
        self.collection = collection
        self.pipeline = pipeline

    def get_by_id(self, id, raw=False):
        return self.get({"_id": Dao.id(id)}, raw=raw)

    def get_all(self, filter=None, sort=None, limit=None, offset=0, with_index=True, last_filter=None, raw=False):
        return self.aggregate(self.pipeline, filter=filter, limit=limit, offset=offset, sort=sort, with_index=with_index, last_filter=last_filter, raw=raw)

    def get(self, filter, raw=False):
        items = self.get_all(filter=filter, limit=1, raw=raw)

        if not items:
            raise DoesNotExist(f"Item {filter} was not found.")

        return items[0]

    def get_count(self, operations, filter={}):
        result = self.aggregate([*operations, {"$match": filter}, {"$count": "count"}])
        return result[0]["count"] if result else 0

    def add(self, item, with_return=True):
        item = self.collection(**self.created(item)).save()

        if with_return:
            return self.get_by_id(item.to_mongo()["_id"])

    def bulk(self, operations, ordered=False):
        return self.collection._get_collection().bulk_write(operations, ordered=ordered)

    def update_by_id(self, id, item, with_return=True):
        for key in ["_id", "created", "modified"]:
            if key in item:
                del item[key]

        self.collection.objects(id=Dao.id(id)).update_one(**self.modified(item))

        if with_return:
            return self.get_by_id(id) 

    def update(self, filter, item, with_return=True, upsert=False):
        self.collection.objects(**filter).update_one(**self.modified(item), upsert=upsert)

        if with_return:
            return self.get(filter)

    def delete_by_id(self, id):
        return self.collection(id=id).delete()

    def delete(self, filter):
        self.collection.objects(**filter).delete()

    def delete_all(self):
        pass

    def aggregate(self, operations, filter=None, limit=None, offset=None, sort=None, with_index=True, last_filter=None, raw=False):
        pipeline = []

        if not raw:
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

        if last_filter:
            pipeline.append({"$match": last_filter})

        pipeline.append({"$set": {"_id": {"$toString": "$_id"}}})

        return list(self.collection.objects.aggregate(pipeline, allowDiskUse=True))

    @staticmethod
    def id(id):
        return ObjectId(id)

    def created(self, document):
        if issubclass(self.collection, LogDocument):
            document["created"] = time.now()

        if hasattr(self.collection, "pre_add"):
            self.collection.pre_add(document)

        return self.modified(document)

    def modified(self, document):
        if issubclass(self.collection, LogDocument):
            document["modified"] = time.now()

        if hasattr(self.collection, "pre_modify"):
            self.collection.pre_modify(document)

        return document
        

class BaseDocument(Document):
    meta = {"allow_inheritance": True, "abstract": True}

    def pre_add(self):
        pass

    def pre_modify(self):
        pass

    def post_modify(self, old):
        pass


class LogDocument(BaseDocument):
    meta = {"allow_inheritance": True, "abstract": True}

    created = LongField(required=True, default=time.now)
    modified = LongField(required=True)


class Stats(EmbeddedDocument):
    date = StringField(required=True)
    planets = LongField(required=True, default=0, min_value=0)  # N of planets.
    time = LongField(required=True, default=0, min_value=0)  # N of seconds.
    data = LongField(required=True, default=0, min_value=0)  # N of bytes.
    items = LongField(required=True, default=0, min_value=0)  # N of processed items.


class Dataset(LogDocument):
    name = StringField(max_length=50, required=True, unique=True)
    fields = MapField(StringField(), required=True)
    item_getter = StringField(max_length=500)
    items_getter = URLField(max_length=500)
    items = ListField(StringField(max_length=50, default=[], required=True))
    deleted_items = ListField(StringField(max_length=50, default=[], required=True))
    size = IntField(min_value=0, required=True)
    type = StringField(max_length=50, required=True)
    priority = IntField(min_value=1, max_value=5, default=3, required=True)
    stats = EmbeddedDocumentListField(Stats, default=[])
    fields_meta = DictField()


dataset_dao = Dao(Dataset, [
    *aggregate_stats_pipeline("stats"),
    {"$project": {"items": 0}}
])


class StarType(EmbeddedDocument):
    spectral_class = StringField(enum=SpectralClass.values())
    spectral_subclass = StringField(enum=SpectralSubclass.values())
    luminosity_class = StringField(enum=LuminosityClass.values())


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
    period = FloatField(min_value=0)
    duration = FloatField(min_value=0)
    depth = FloatField(min_value=0, max_value=1)
    local_view = EmbeddedDocumentField(View)
    global_view = EmbeddedDocumentField(View)

class Discovery(EmbeddedDocument):
    author = StringField()
    date = LongField(required=True, default=time.now)


class Orbit(EmbeddedDocument):
    period = FloatField(min_value=0)
    eccentricity = FloatField(min_value=0)
    inclination = FloatField(min_value=0)
    velocity = FloatField(min_value=0)
    semi_major_axis = FloatField(min_value=0)


class PlanetProperties(EmbeddedDocument):
    name = StringField(required=True, max_length=100)
    type = StringField(enum=PlanetType.values())
    diameter = FloatField(min_value=0)
    distance = FloatField(min_value=0)
    mass = FloatField(min_value=0)
    density = FloatField(min_value=0)
    surface_gravity = FloatField(min_value=0)
    surface_temperature = FloatField(min_value=0)
    life_conditions = StringField(enum=LifeType.values())
    transit = EmbeddedDocumentField(Transit)
    orbit = EmbeddedDocumentField(Orbit)
    dataset = ReferenceField(Dataset, required=True)
    processed = BooleanField()
    discovery = EmbeddedDocumentField(Discovery)


class Planet(EmbeddedDocument):
    _id = ObjectIdField(required=True, default=lambda: ObjectId())
    properties = ListField(EmbeddedDocumentField(PlanetProperties), default=[])
    status = StringField(required=True, enum=PlanetStatus.values(), default=PlanetStatus.CONFIRMED.value)


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


class Alias(EmbeddedDocument):
    name = StringField(required=True)
    dataset = StringField(required=True)

class Star(Document): 
    properties = EmbeddedDocumentListField(StarProperties, default=[])
    light_curves = EmbeddedDocumentListField(LightCurve, default=[])
    planets = EmbeddedDocumentListField(Planet, default=[])
    aliases = EmbeddedDocumentListField(Alias, default=[])

    meta = {
        "indexes": ["properties.name", "planets.properties.name", "light_curves.name", "aliases.name"]
    }


star_dao = Dao(Star, [
    {"$addFields": {"datasets": {"$add": [
        {"$size": {"$ifNull": ["$properties", []]}},
        {"$size": {"$ifNull": ["$light_curves", []]}},
        {"$size": {"$ifNull": ["$names", []]}}
    ]}, "n_planets": {"$size": {"$ifNull": ["$planets", []]}}}}
])


class GlobalStats(BaseDocument):
    date = StringField(required=True)
    volunteers = IntField(required=True, default=0)
    planets = IntField(required=True, default=0)
    stars = IntField(required=True, default=0)
    time = FloatField(required=True, default=0)
    data = FloatField(required=True, default=0)
    items = IntField(required=True, default=0)


global_stats_dao = Dao(GlobalStats, aggregate_stats_pipeline(""))

class Store(BaseDocument):
    key = StringField(required=True, index=True)
    value = DynamicField()


store_dao = Dao(Store)

class UserPersonal(EmbeddedDocument):
    sex = StringField(enum=Sex)
    country = StringField(max_length=10)
    birth = LongField()
    contact = StringField(max_length=50)
    text = StringField(max_length=100)


class User(LogDocument):
    name = StringField(required=True, max_length=20)
    username = EmailField(max_length=200, unique=True, sparse=True)
    password = BinaryField(max_length=200)
    role = IntField(required=True, default=UserRole.AUTH.value, enum=UserRole.values())
    fb_id = StringField(max_length=200, unique=True, sparse=True)
    google_id = StringField(max_length=200, unique=True, sparse=True)
    avatar = StringField(max_length=50)
    personal = EmbeddedDocumentField(UserPersonal)
    stats = EmbeddedDocumentListField(Stats, default=[])
    online = BooleanField(required=True, default=False)

    PASSWORD_MIN_LENGTH = 6
    PASSWORD_MAX_LENGTH = 50

    def pre_add(self):
        if "fb_id" in self and self["fb_id"]:
            pass
        elif "google_id" in self and self["google_id"]:
            pass
        elif "password" in self and self["password"]:
            if "username" not in self or not self["username"]:
                raise ValidationError("Username is required.")

            if "name" not in self or not self["name"]:
                raise ValidationError("Name is required.")
        else:
            raise ValidationError("User must have credentials (local or external).")

    def pre_modify(self):
        if "password" in self and self["password"]:
            if "password" in self:
                if not self["password"] or len(self["password"]) < User.PASSWORD_MIN_LENGTH:
                    raise ValidationError(f"Minimum length of password is {User.PASSWORD_MIN_LENGTH}.")

                if not self["password"] or len(self["password"]) > User.PASSWORD_MAX_LENGTH:
                    raise ValidationError(f"Maximum length of password is {User.PASSWORD_MAX_LENGTH}.")

                self["password"] = security_service.hash(self["password"])


user_dao = Dao(User, aggregate_stats_pipeline("stats"))


class Message(LogDocument):
    text = StringField(required=True, min_length=1, max_length=300)
    user_id = ReferenceField(User)
    tag = StringField(required=True, default=MessageTag.MESSAGE.value)


message_dao = Dao(Message, [
    {"$lookup": {
        "from": "user", "localField": "user_id", "foreignField": "_id", "as": "user"
    }},
    {"$unwind": {"path": "$user", "preserveNullAndEmptyArrays": True}},
    {"$set": {"user._id": {"$toString": "$user._id"}}},
    {"$project": {"user_id": 0}},
    *aggregate_stats_pipeline(field="user.stats")
])