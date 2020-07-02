from mongoengine import *


class DatasetField(EmbeddedDocument):
    name = StringField(required=True, max_length=50)
    prefix = StringField(max_length=50)
    multiple = FloatField()


class Dataset(Document):
    name = StringField(max_length=50, required=True, unique=True)
    fields = MapField(EmbeddedDocumentField(DatasetField), required=True)
    item_getter = URLField(max_length=500, regex=".*{#}.*")
    items_getter = URLField(max_length=500)
    items = ListField(StringField(max_length=50, default=[], required=True))
    total_size = IntField(min_value=0, required=True)
    type = StringField(max_length=50, required=True)


class StarProperties(EmbeddedDocument):
    dataset = ReferenceField(Dataset, required=True)
    name = StringField(required=True, max_length=50)
    diameter = FloatField(min_value=0)
    mass = FloatField(min_value=0)
    temperature = IntField()
    distance = FloatField(min_value=0)

    meta = {
        "indexes": ["name"]
    }


class Transit(EmbeddedDocument):
    period = FloatField(min_value=0, required=True)
    duration = FloatField(min_value=0, required=True)
    depth = FloatField(min_value=0, max_value=1, required=True)


class PlanetProperties(EmbeddedDocument):
    name = StringField(required=True, max_length=50)
    diameter = FloatField(min_value=0)
    mass = FloatField(min_value=0)
    density = FloatField(min_value=0)
    semi_major_axis = FloatField(min_value=0)
    orbital_velocity = FloatField(min_value=0)
    live_conditions = StringField()  # TODO: DB table LiveType?
    transit = EmbeddedDocumentField(Transit)
    dataset = ReferenceField(Dataset, required=True)

    meta = {
        "indexes": ["name"]
    }


class Planet(Document):
    properties = ListField(EmbeddedDocumentField(PlanetProperties, required=True), required=True, default=[])
    star = ReferenceField("Star", required=True)


class LightCurve(EmbeddedDocument):
    dataset = ReferenceField(Dataset, required=True)
    planets = ListField(ReferenceField(Planet), required=True, default=[])


class Star(Document):
    properties = ListField(EmbeddedDocumentField(StarProperties), default=[])
    light_curve = ListField(EmbeddedDocumentField(LightCurve), default=[])
    planets = ListField(ReferenceField(Planet), default=[])


class UserPersonal(EmbeddedDocument):
    is_male = BooleanField()
    country = StringField(max_length=10)
    birth = LongField()


class User(Document):
    name = StringField(required=True, max_length=50)

    email = EmailField(max_length=200, unique=True, sparse=True)
    password = StringField(max_length=200)
    fb_id = StringField(max_length=200, unique=True, sparse=True)
    avatar = StringField(max_length=200)
    personal = EmbeddedDocumentField(UserPersonal, default={})


# TODO: Star aliases.
# TODO: map_units dataset?
# TODO: LocalDataset - upload file to DB.
# TODO: Radial velocity datasets.
# TODO: Star metalicity?
