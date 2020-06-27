from pymongo import UpdateOne

from .Service import Service


class StarService(Service):

    def __init__(self):
        super().__init__()

        self.setup(self.db.Star, [
            {"$unwind": "$properties"},
            {"$lookup": {"from": "dataset", "localField": "properties.dataset", "foreignField": "_id", "as": "properties.dataset"}},
            {"$addFields": {"properties.dataset": "$properties.dataset.name"}},
            {"$unwind": "$properties.dataset"},
            {"$group": {"_id": "$_id", "properties": {"$push": "$properties"}}}
        ])

    def upsert_all_by_name(self, stars):
        operations = []

        for star in stars:
            star.validate()
            star = star.to_mongo()

            operations.append(UpdateOne(
                {"properties": {"$elemMatch": {"name": star["properties"][0]["name"]}}},
                {"$push": {"properties": {"$each": star["properties"]}}},
                upsert=True
            ))

        self.db.Star._get_collection().bulk_write(operations, ordered=False)