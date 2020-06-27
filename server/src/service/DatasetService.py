import pandas as pd

from .Service import Service
from .StarService import StarService
from constants.Dataset import DatasetType


class DatasetService(Service):

    def __init__(self):
        super().__init__()

        self.setup(self.db.Dataset, [
            {"$addFields": {"current_size": {"$size": "$items"}}},
            {"$project": {"items": 0}}
        ])

        self.star_service = StarService()

    def add(self, dataset):
        items = pd.read_csv(dataset["items_getter"])
        dataset["total_size"] = len(items.index)
        items = self.standardize_dataset(dataset, items)
        dataset["items"] = items["name"].tolist()

        if dataset["type"] == DatasetType.STAR_PROPERTIES.name:
            dataset["items"] = []
            result = self.json(self.db.Dataset(**dataset).save())
            stars = list(map(lambda star: self.db.Star(properties=[{**star, "dataset": result["_id"]}]), items.to_dict("records")))
            self.star_service.upsert_all_by_name(stars)
        else:
            result = self.json(self.db.Dataset(**dataset).save())

        return self.get(result["_id"])

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
