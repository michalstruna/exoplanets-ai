import pandas as pd
from mongoengine.errors import DoesNotExist
import re
import numpy as np

from utils.native import Dict
from .Base import Service
from .Star import StarService
from constants.Dataset import DatasetType, DatasetFields
from utils import time
import db
from .Stats import GlobalStatsService
from service.Message import MessageService
from constants.Message import MessageTag

FIELD_OPERATORS = "*\-+/"

class DatasetService(Service):

    def __init__(self):
        super().__init__(db.dataset_dao)
        self.star_service = StarService()
        self.stats_service = GlobalStatsService()
        self.message_service = MessageService()

    def add(self, dataset):
        stats, global_stats = {"time": time.now()}, {}
        items = pd.read_csv(dataset["items_getter"])
        dataset["size"] = len(items.index)
        self.update_meta(dataset)
        items = self.standardize_dataset(dataset, items)
        items = items.where(pd.notnull(items), None)

        if "name" in items:
            dataset["items"] = items["name"].tolist()

        if dataset["type"] == DatasetType.STAR_PROPERTIES.name:
            stats["data"], stats["items"] = items.memory_usage().sum(), len(items)
            items["dataset"] = dataset["name"]
            stars = self.star_service.complete_stars(items.to_dict("records"))
            global_stats["stars"] = self.star_service.upsert_all_by_name(stars).upserted_count
        elif dataset["type"] == DatasetType.SYSTEM_NAMES.name:
            stats["data"], stats["items"] = items.memory_usage().sum(), len(items)
            items["names"] = items.stack().groupby(level=0).apply(list).tolist()
            items = items[["names"]]
            items["dataset"] = dataset["name"]
            self.star_service.upsert_all_aliases(items.to_dict("records"))

        stats["time"] = time.now() - stats["time"]  # Update local and global stats.
        dataset["stats"] = [{"date": time.day(), **stats}]
        result = self.dao.add(dataset)
        self.stats_service.add(**stats, **global_stats)
        self.message_service.add({"text": dataset["name"], "tag": MessageTag.NEW_DATASET.value})

        self.star_service.delete_empty()

        return result


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
        ], filter={"item": {"$ne": None}}, limit=1, sort={"priority": -1, "created": 1})

        if not tasks or not "item" in tasks[0]:
            raise DoesNotExist(f"No data for processing.")

        #self.collection.objects(id=id).update_one(pull__items=items[0]["name"])
        # TODO: When item is removed and client stop processing, item will be lost. Add temp collection for processing items?

        task = tasks[0]
        task["dataset_id"] = str(task["dataset_id"])
        task["meta"] = {"created": time.now()}

        return task

    def update_meta(self, dataset):
        dataset["fields_meta"] = {}

        for field_name in dataset["fields"]:
            field = dataset["fields"][field_name]
            dataset["fields_meta"][field_name] = self.parse_field_mask(field)

    def standardize_dataset(self, dataset, items):
        fields_map = self.fields_to_fields_map(dataset)
        items = items[fields_map.keys()].rename(columns=fields_map)

        for field_name in dataset["fields"]:
            items[field_name] = self.get_field_value(items, field_name, dataset)

        items = items.where(pd.notnull(items), None)

        return items

    def parse_field_mask(self, mask):
        if "{" not in mask or "}" not in mask:
            return None

        prefix, body, suffix = re.split("{|}", mask)
        prefix, rem_prefix = prefix.split("||") if "||" in prefix else (prefix, "")
        suffix, rem_suffix = suffix.split("||") if "||" in suffix else (suffix, "")

        name, ops_str = "", ""
        search = re.search(f"[{FIELD_OPERATORS}]", body)
        operands, operators, ops = [], [], []

        if search:
            ind = search.start()
            name = body[:ind]
            ops_str = body[ind:]
        else:
            name = body

        if ops_str:
            operators = re.split("[0-9]+", ops_str)
            operators.pop()
            operands = re.split(f"[{FIELD_OPERATORS}]", ops_str)[1:]

        for i in range(len(operands)):
            ops.append([operators[i], float(operands[i])])

        return {"prefix": prefix, "rem_prefix": rem_prefix, "name": name, "ops": ops, "suffix": suffix, "rem_suffix": rem_suffix}

    def get_field_value(self, source, field_name, dataset):
        field_meta = dataset["fields_meta"][field_name]

        if not field_meta:
            return None

        na_vals = pd.isna(source[field_name])
        val = source[field_name].astype(str)
        val = val.str.replace(f"(^{field_meta['rem_prefix']})|({field_meta['rem_suffix']}$)", "", regex=True)

        if field_meta["ops"]:
            for op in field_meta["ops"]:
                val = val.astype(float)

                if op[0] == "+":
                    val += op[1]
                elif op[0] == "*":
                    val *= op[1]
                elif op[0] == "-":
                    val -= op[1]
                elif op[0] == "/":
                    val /= op[1]

            val = val.replace(np.nan, '', regex=True).astype(str)

        field_type = DatasetFields[dataset["type"]].value[field_name]["type"]
        result = field_meta["prefix"] + val + field_meta["suffix"] if field_type == str else val.astype(field_type)
        result[na_vals] = None
        return result

    def fields_to_fields_map(self, dataset):
        fields, meta = dataset["fields"], dataset["fields_meta"]
        result = {}

        for key in fields:
            if meta[key]:
                result[meta[key]["name"]] = key

        return result

    def get_all_by_names(self, names):
        return self.get_all({"name": {"$in": names}})

    def update(self, id, item, with_return=True):
        if "name" in item:  # If dataset name changed, change dataset name in external structures too.
            dataset = self.get_by_id(id)

            if dataset["name"] != item["name"]:
                self.update_meta(item)
                self.star_service.update_array_items("properties", "dataset", dataset["name"], item["name"])  # TODO: Also update planets.

        return super().update(id, item, with_return)

    def delete(self, id):
        dataset = self.get_by_id(id)
        self.star_service.delete_array_items("properties", "dataset", dataset["name"])
        self.star_service.delete_array_items("light_curves", "dataset", dataset["name"])
        self.star_service.delete_array_items("aliases", "dataset", dataset["name"])
        self.star_service.delete_empty()
        return super().delete(id)

    def reset(self, id):
        dataset = self.get_by_id(id)
        self.delete(id)  # TODO: Transaction?
        self.add(Dict.exclude_keys(dataset, "_id", "index"))
