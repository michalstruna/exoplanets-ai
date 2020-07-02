from abc import ABC
from bson.objectid import ObjectId
from mongoengine.errors import DoesNotExist
import json

import db


class Service(ABC):

    def __init__(self):
        self.db = db
        self.collection = None
        self.pipeline = None

    def setup(self, collection, pipeline=[]):
        self.collection = collection
        self.pipeline = pipeline

    def json(self, queryset):
        result = json.loads(queryset.to_json())
        result["_id"] = result["_id"]["$oid"]
        return result

    def get(self, id):
        return self.get_by_filter({"_id": self.id(id)})

    def get_by_filter(self, filter):
        items = self.get_all(filter=filter, limit=1)

        if not items:
            raise DoesNotExist(f"Item {filter} was not found.")

        return items[0]

    def id(self, id):
        return ObjectId(id)

    def get_all(self, filter={}, limit=None, skip=None):
        return self.aggregate(self.pipeline, filter, limit, skip)

    def aggregate(self, operations, filter={}, limit=None, skip=None):
        pipeline = [{"$match": filter}]

        if limit:
            pipeline.append({"$limit": limit})

        if skip:
            pipeline.append({"$skip": skip})

        pipeline += operations

        return list(self.collection.objects.aggregate(pipeline))

    def add(self, item, return_item=True):
        item = self.collection(**item).save()

        if return_item:
            return self.get(item.to_mongo()["_id"])

    def delete(self, id):
        return self.collection(_id=id).delete()

    def update(self, id, item):
        self.collection.objects(id=id).update_one(**item)
        return self.get(id)