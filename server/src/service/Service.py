from abc import ABC
from bson.objectid import ObjectId
from mongoengine.errors import DoesNotExist
import json
import math

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

    def get_all(self, filter=[], sort=[], limit=math.inf, offset=0):
        return self.aggregate(self.pipeline, filter, limit, offset, sort)

    def get_count(self, filter={}):
        result = self.aggregate([{"$count": "count"}], filter)

        return result[0]["count"] if result else 0

    def aggregate(self, operations, filter={}, limit=None, skip=None, sort=None):
        pipeline = [{"$match": filter}]

        if skip:
            pipeline.append({"$skip": skip})

        if limit:
            pipeline.append({"$limit": limit})

        pipeline += operations

        if sort:
            pass

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