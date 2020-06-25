import pandas as pd

from .Service import Service
from constants.Dataset import DatasetType
from .StarService import StarService


class DatasetService(Service):

    def __init__(self):
        super().__init__()
        self.star_service = StarService()

    def get(self, id):
        return self.db.Dataset.objects.get(id=id)

    def get_all(self):
        return self.json(self.db.Dataset.objects())

    def add(self, dataset):
        items = pd.read_csv(dataset["items_getter"])
        dataset["total_size"] = len(items.index)
        items = self.standardize_dataset(dataset, items)

        if dataset["type"] == DatasetType.STAR_PROPERTIES.name:
            dataset["items"] = []
            result = self.db.Dataset(**dataset).save()
            stars = list(map(lambda star: self.db.Star(name=star["name"], properties=[star]), items.to_dict("records")))
            self.star_service.upsert_all_by_name(stars)
        else:
            dataset["items"] = items["name"].tolist()
            result = self.db.Dataset(**dataset).save()

        return result

    def delete(self, id):
        return self.db.Dataset(id=id).delete()

    def update(self, id, dataset):
        return self.db.Dataset.objects(id=id).update_one(**dataset)

    def standardize_dataset(self, dataset, items):
        items = items.rename(columns=self.fields_to_fields_map(dataset["fields"]))

        for field_name in dataset["fields"]:
            field = dataset["fields"][field_name]

            if "prefix" in field and field["prefix"]:
                items[field_name] = field["prefix"] + items[field_name].astype(str)

        return items

    def fields_to_fields_map(self, fields):
        result = {}

        for key in fields:
            result[fields[key]["name"]] = key

        return result
