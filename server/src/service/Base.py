from abc import ABC
import math


class Service(ABC):

    def __init__(self, dao=None):
        self.dao = dao

    def get_by_id(self, id):
        return self.dao.get_by_id(id)

    def get(self, filter):
        return self.dao.get(filter)

    def get_all(self, filter=[], sort=[], limit=math.inf, offset=0):
        return self.dao.get_all(filter=filter, limit=limit, offset=offset, sort=sort)

    def get_count(self, filter={}):
        return self.dao.get_count(filter)

    def aggregate(self, operations, filter={}, limit=None, skip=None, sort=None):
        return self.dao.aggregate(operations, filter, limit, skip, sort)

    def add(self, item, with_return=True):
        return self.dao.add(item, with_return=with_return)

    def delete(self, id):
        return self.dao.delete_by_id(id)

    def update(self, id, item, with_return=True):
        return self.dao.update_by_id(id, item, with_return=with_return)