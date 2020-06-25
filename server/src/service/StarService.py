from pymongo import UpdateOne
from bson.objectid import ObjectId

from .Service import Service


class StarService(Service):

    def get(self, id):
        return self.get_all(filter={"_id": ObjectId(id)}, limit=1)

    def get_all(self, filter={}, limit=None, skip=None):
        return self.aggregate(self.db.Star, [
            {"$unwind": "$properties"},
            {"$lookup": {"from": "dataset", "localField": "properties.dataset", "foreignField": "_id", "as": "properties.dataset"}},
            {"$addFields": {"properties.dataset": "$properties.dataset.name"}},
            {"$unwind": "$properties.dataset"},
            {"$group": {"_id": "$_id", "name": {"$first": "$name"}, "properties": {"$push": "$properties"}}}
        ], filter=filter, limit=limit, skip=skip)

    def add(self, star):
        return self.json(self.db.Star(**star).save())

    def delete(self, id):
        return self.db.Star(_id=id).delete()

    def update(self, id, star):
        return self.db.Star.objects(id=id).update_one(**star)

    def upsert_all_by_name(self, stars):
        operations = []

        for star in stars:
            star.validate()
            star = star.to_mongo()

            operations.append(UpdateOne(
                {"name": star["name"]},
                {"$set": {"name": star["name"]}, "$push": {"properties": {"$each": star["properties"]}}},
                upsert=True
            ))

        self.db.Star._get_collection().bulk_write(operations, ordered=False)

# TODO: self.json in delete and update?
