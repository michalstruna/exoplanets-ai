from pymongo import UpdateOne

from .Base import Service
import db


class StarService(Service):

    def __init__(self):
        super().__init__(db.star_dao)

    def upsert_all_by_name(self, stars):
        operations = []

        for star in stars:
            star.validate()
            star = star.to_mongo()  # TODO: Remove?

            operations.append(UpdateOne(
                {"properties": {"$elemMatch": {"name": star["properties"][0]["name"]}}},
                {"$push": {"properties": {"$each": star["properties"]}}},
                upsert=True
            ))

        db.star_dao.collection._get_collection().bulk_write(operations, ordered=False)
