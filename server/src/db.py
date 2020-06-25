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
    dataset = ReferenceField(Dataset)
    name = StringField(required=True, max_length=50)
    diameter = FloatField(min_value=0)
    mass = FloatField(min_value=0)
    temperature = IntField()
    distance = FloatField(min_value=0)

    meta = {
        "indexes": ["name"]
    }


class Star(Document):
    name = StringField(required=True, max_length=50, unique=True)
    properties = ListField(EmbeddedDocumentField(StarProperties), default=[], required=True)

    meta = {
        "indexes": ["name"]
    }

# TODO: Star aliases.
# TODO: map_units dataset?
# TODO: LocalDataset - upload file to DB.
# TODO: Radial velocity datasets.
# TODO: Star metalicity?
