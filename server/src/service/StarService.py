from pymongo import UpdateOne

from .Service import Service


class StarService(Service):

    def get(self, id):
        return self.json(self.db.Star.objects.get(id=id))

    def get_all(self):
        return self.json(self.db.Star.objects())

    def add(self, star):
        return self.json(self.db.Star(**star).save())

    def delete(self, id):
        return self.db.Star(id=id).delete()

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