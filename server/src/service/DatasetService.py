import pandas as pd
from bson.objectid import ObjectId
from mongoengine.errors import DoesNotExist

from .Service import Service
from .StarService import StarService
from constants.Dataset import DatasetType


class DatasetService(Service):

    def __init__(self):
        super().__init__()
        self.star_service = StarService()

    def get(self, id):
        items = self.get_all(filter={"_id": ObjectId(id)}, limit=1)

        if not items:
            raise DoesNotExist(f"Dataset with id {id} was not found.")

        return items[0]

    def get_all(self, filter={}, limit=None, skip=None):
        return self.aggregate(self.db.Dataset, [
            {"$addFields": {"current_size": {"$size": "$items"}}},
            {"$project": {"items": 0}}
        ], filter, limit, skip)

    def add(self, dataset):
        items = pd.read_csv(dataset["items_getter"])
        dataset["total_size"] = len(items.index)
        items = self.standardize_dataset(dataset, items)

        if dataset["type"] == DatasetType.STAR_PROPERTIES.name:
            dataset["items"] = []
            result = self.db.Dataset(**dataset).save()
            stars = list(map(lambda star: self.db.Star(name=star["name"], properties=[{**star, "dataset": result["id"]}]), items.to_dict("records")))
            self.star_service.upsert_all_by_name(stars)
        else:
            dataset["items"] = items["name"].tolist()
            result = self.db.Dataset(**dataset).save()

        return self.get(result["id"])

    def delete(self, id):
        return self.db.Dataset(id=id).delete()

    def update(self, id, dataset):
        self.db.Dataset.objects(id=id).update_one(**dataset)
        return self.get(id)

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
