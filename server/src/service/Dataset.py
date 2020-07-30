import pandas as pd
from mongoengine.errors import DoesNotExist

from .Base import Service
from .Star import StarService
from constants.Dataset import DatasetType
from utils import time
import db


class DatasetService(Service):

    def __init__(self):
        super().__init__(db.dataset_dao)
        self.star_service = StarService()

    def add(self, dataset):
        start = time.now()
        items = pd.read_csv(dataset["items_getter"])
        dataset["total_size"] = len(items.index)
        items = self.standardize_dataset(dataset, items)

        items = items.where(pd.notnull(items), None)
        dataset["items"] = items["name"].tolist()

        if dataset["type"] == DatasetType.STAR_PROPERTIES.name:
            items["density"] = 1410 * items["mass"] / items["diameter"] ** 3
            items["gravity"] = 274 * items["mass"] / items["diameter"] ** 2
            items["luminosity"] = (items["diameter"] ** 2) * ((items["temperature"] / 5780) ** 4)  # TODO: Constants.
            items = items.where(pd.notnull(items), None)

            dataset["items"] = []
            dataset["processed"] = items.memory_usage().sum()
            #self.add_processed(dataset, items.memory_usage().sum())  # TODO

            result = self.dao.add(dataset)#self.json(self.collection(**dataset).save())

            stars = list(map(lambda star: db.Star(properties=[{**star, "dataset": result["_id"]}]), items.to_dict("records")))
            self.star_service.upsert_all_by_name(stars)
        else:
            result = self.dao.add(dataset)

        end = time.now()

        return self.update(result["_id"], {"time": end - start})

    def add_processed(self, dataset, n_bytes):
        if isinstance(dataset, str):
            pass  # TODO: Update dataset by id.
        elif isinstance(dataset["processed"], int):
            dataset["processed"] += n_bytes
            return dataset
        else:
            dataset["processed"] = n_bytes
            return dataset

    def get_task(self):
        tasks = self.aggregate([
            {"$addFields": {"item": {"$arrayElemAt": ["$items", 0]}}},
            {"$project": {"_id": 0, "dataset_id": "$_id", "item": "$item", "item_getter": "$item_getter", "type": "$type"}}
        ], filter={"items": {"$ne": []}}, limit=1, sort={"priority": -1, "created": 1})

        if not tasks or not "item" in tasks[0]:
            raise DoesNotExist(f"No data for processing.")

        #self.collection.objects(id=id).update_one(pull__items=items[0]["name"])
        # TODO: When item is removed and client stop processing, item will be lost. Add temp collection for processing items?

        task = tasks[0]
        task["dataset_id"] = str(task["dataset_id"])
        task["meta"] = {"created": time.now()}

        return task

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