from abc import ABC
from bson.objectid import ObjectId
from mongoengine import DoesNotExist

from utils import time

class Service(ABC):

    def __init__(self, dao=None):
        self.dao = dao

    def get_by_id(self, id, raw=False):
        return self.dao.get_by_id(id, raw=raw)

    def get(self, filter, raw=False):
        return self.dao.get(filter, raw=raw)

    def get_all(self, filter=None, sort=None, limit=None, offset=None, with_index=True, last_filter=None, raw=False):
        return self.aggregate(self.dao.pipeline, filter=filter, limit=limit, skip=offset, sort=sort, with_index=with_index, last_filter=last_filter, raw=raw)

    def get_count(self, filter={}, **kwargs):
        return self.dao.get_count(self.dao.pipeline, filter=filter)

    def aggregate(self, operations, filter=None, limit=None, skip=None, sort=None, with_index=False, last_filter=None, raw=False):
        return self.dao.aggregate(operations, filter, limit, skip, sort, with_index, last_filter, raw=raw)

    def add(self, item, with_return=True):
        return self.dao.add(item, with_return=with_return)

    def delete(self, id):
        return self.dao.delete_by_id(id)

    def update(self, id, item, with_return=True):
        return self.dao.update_by_id(id, item, with_return=with_return)

    def update_array_items(self, array_name, field_name, old_field_value, new_field_value):
        self.dao.collection._get_collection().update_many(
            {},
            {"$set": {f"{array_name}.$[current].{field_name}": new_field_value}},
            array_filters=[{f"current.{field_name}": old_field_value}]
        )

    def delete_array_items(self, array_name, field_name, field_value):
        self.dao.collection._get_collection().update_many({}, {"$pull": {array_name: {field_name: field_value}}})

    def check_selection(self, item, selection):
        result = {}

        for category in selection:
            if not selection[category]:
                continue

            result[category] = selection[category]

            if category not in item or type(item[category]) != list:
                raise DoesNotExist(f"Invalid selection: Category \"{category}\" does not exist.")

            for selection_item in selection[category]:
                if not list(filter(lambda x: x["dataset"] == selection_item, item[category])):
                    raise DoesNotExist(f"Invalid selection: Dataset \"{selection_item}\" does not exist in \"{category}\".")

        return result

    def get_rank(self, id, sort):
        items = self.get_all(sort=sort, last_filter={"_id": ObjectId(id)})
        
        if not items:
            raise DoesNotExist(f"Item with if {id} was not found.")
        
        return items[0]["index"]

    def add_stats(self, id, field="stats", **kwargs):
        item = self.get_by_id(id, raw=True)
        stats = item[field]
        stat = stats[-1] if stats else {"date": None}

        if stat["date"] != time.day():
            stat = {"date": time.day()}
            stats.append(stat)

        for prop in kwargs:
            stat[prop] = stat[prop] + kwargs[prop] if prop in stat else kwargs[prop]

        return self.update(id, {"stats": stats})
