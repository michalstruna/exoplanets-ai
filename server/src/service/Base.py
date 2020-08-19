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
        return self.aggregate(self.dao.pipeline, filter=filter, limit=limit, skip=offset, sort=sort, with_index=True)

    def get_count(self, filter={}, **kwargs):
        return self.dao.get_count(self.dao.pipeline, filter=filter)

    def aggregate(self, operations, filter={}, limit=None, skip=0, sort=None, with_index=False):
        result = self.dao.aggregate(operations, filter, limit, skip, sort)

        if with_index:
            index = skip + 1 if skip is not None else 1

            for item in result:
                item["index"] = index
                index += 1

        return result

    def add(self, item, with_return=True):
        return self.dao.add(item, with_return=with_return)

    def delete(self, id):
        return self.dao.delete_by_id(id)

    def update(self, id, item, with_return=True):
        return self.dao.update_by_id(id, item, with_return=with_return)