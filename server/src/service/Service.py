from abc import ABC
from bson.objectid import ObjectId
from mongoengine.errors import DoesNotExist

import db


class Service(ABC):

    def __init__(self):
        self.db = db
        self.collection = None
        self.pipeline = None

    def setup(self, collection, pipeline=[]):
        self.collection = collection
        self.pipeline = pipeline

    def get(self, id):
        items = self.get_all(filter={"_id": ObjectId(id)}, limit=1)

        if not items:
            raise DoesNotExist(f"Item with id {id} was not found.")

        return items[0]

    def get_all(self, filter={}, limit=None, skip=None):
        return self.aggregate(self.collection, self.pipeline, filter, limit, skip)

    def aggregate(self, model, operations, filter={}, limit=None, skip=None):
        pipeline = [{"$match": filter}]

        if limit:
            pipeline.append({"$limit": limit})

        if skip:
            pipeline.append({"$skip": skip})

        pipeline += operations

        return list(model.objects.aggregate(pipeline))

    def add(self, item):
        item = self.collection(**item).save()
        return self.get(item["_id"])

    def delete(self, id):
        return self.collection(_id=id).delete()

    def update(self, id, item):
        self.collection.objects(id=id).update_one(**item)
        return self.get(id)