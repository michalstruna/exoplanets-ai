from mongoengine import *
from bson.objectid import ObjectId

from constants.Database import *
from constants.Star import *
from constants.User import UserRole
from utils import time
from service.Security import SecurityService


security_service = SecurityService()

stats_fields = ("data", "items", "planets", "time")
global_stats_fields = (*stats_fields, "volunteers", "stars")


def aggregate_stats_pipeline(days=7, global_stats=False):
    before = time.day(-days)
    result = []

    if not global_stats:
        result.append({"$unwind": {"path": f"$stats", "preserveNullAndEmptyArrays": True}})

    path = f"" if global_stats else "stats."
    target = f"" if global_stats else ".stats"
    fields = global_stats_fields if global_stats else stats_fields

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

    def __init__(self, collection, pipeline=[], stats=None):
        self.collection = collection
        self.pipeline = pipeline
        self.stats = stats

    def get_by_id(self, id):
        return self.get({"_id": Dao.id(id)})

    def get_all(self, filter=None, sort=None, limit=None, offset=0, with_index=True):
        return self.aggregate(self.pipeline, filter=filter, limit=limit, offset=offset, sort=sort, with_index=with_index)

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
        return self.collection(id=id).delete()

    def delete(self, filter):
        self.collection.objects(**filter).delete()

    def delete_all(self):
        pass

    def aggregate(self, operations, filter=None, limit=None, offset=None, sort=None, with_index=True):
        pipeline = []

        if self.stats is not None:
            pipeline += aggregate_stats_pipeline(global_stats=self.stats == "")

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

        self.collection.pre_add(document)
        return self.modified(document)

    def modified(self, document):
        if issubclass(self.collection, LogDocument):
            document["modified"] = time.now()

        self.collection.pre_modify(document)

        return document


class BaseDocument(Document):
    meta = {"allow_inheritance": True, "abstract": True}

    def pre_add(self):
        pass

    def pre_modify(self):
        pass


class LogDocument(BaseDocument):
    meta = {"allow_inheritance": True, "abstract": True}

    created = LongField(required=True)
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


dataset_dao = Dao(Dataset, [{"$project": {"items": 0}}], stats="stats")


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


class GlobalStats(BaseDocument):
    date = StringField(required=True)
    volunteers = IntField(required=True, default=0)
    planets = IntField(required=True, default=0)
    stars = IntField(required=True, default=0)
    time = FloatField(required=True, default=0)
    data = FloatField(required=True, default=0)
    items = IntField(required=True, default=0)


global_stats_dao = Dao(GlobalStats, stats="")


class UserPersonal(EmbeddedDocument):
    sex = BooleanField()
    country = StringField(max_length=10)
    birth = LongField()
    contact = StringField(max_length=50)
    text = StringField(max_length=100)


class User(LogDocument):

    name = StringField(required=True, unique=True, sparse=True, max_length=20)
    username = EmailField(max_length=200, unique=True, sparse=True)
    password = BinaryField(max_length=200)
    role = IntField(required=True, default=UserRole.AUTH.value, enum=UserRole.values())
    fb_id = StringField(max_length=200, unique=True, sparse=True)
    avatar = StringField(max_length=200)
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


user_dao = Dao(User, stats="stats")


# TODO: Star aliases.
# TODO: map_units dataset?
# TODO: LocalDataset - upload file to DB.
# TODO: Radial velocity datasets.
# TODO: Star metalicity?
