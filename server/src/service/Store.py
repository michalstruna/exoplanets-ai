from .Base import Service
import db

class StoreService(Service):

    def __init__(self):
        super().__init__(db.store_dao)

    def get(self, key):
        try:
            return super().get({"key": key})["value"]
        except:
            import traceback
            traceback.print_exc()
            return None

    def add(self, key, value):
        return super().add({"key": key, "value": value})

    def update(self, key, value):
        return self.dao.update({"key": key}, {"value": value})