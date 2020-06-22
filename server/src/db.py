from mongoengine import *


class Dataset(EmbeddedDocument):
    name = StringField(max_length=50, required=True)
    map_fields = MapField(StringField(max_length=50), required=True)
    url_getter = URLField(max_length=500, required=True)

    meta = {"allow_inheritance": True}


class ItemDataset(Dataset):
    url_getter = URLField(max_length=500, required=True, regex=".*{#}.*")


class Pipeline(Document):
    name = StringField(max_length=50, required=True, unique=True)
    star_dataset = EmbeddedDocumentField(Dataset)
    light_curve_dataset = EmbeddedDocumentField(ItemDataset)


class StarPipeline:
    pipeline = ReferenceField(Pipeline)
    name = StringField(max_length=50, required=True, unique=True)
    radius = LongField(min_value=0)
    mass = LongField(min_value=0)
    temperature = IntField()
    distance = IntField(min_value=0)


class Star(Document):
    name = StringField(max_length=50, required=True, unique=True)
    pipelines = ListField(StarPipeline)

# TODO: Star aliases.
# TODO: map_units dataset?
# TODO: LocalDataset - upload file to DB.
# TODO: Radial velocity datasets.
# TODO: Star metalicity?
