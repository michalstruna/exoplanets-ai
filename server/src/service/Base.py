from abc import ABC


class Service(ABC):

    def __init__(self, dao=None):
        self.dao = dao

    def get_by_id(self, id):
        return self.dao.get_by_id(id)

    def get(self, filter):
        return self.dao.get(filter)

    def get_all(self, filter=None, sort=None, limit=None, offset=None):
        return self.aggregate(self.dao.pipeline, filter=filter, limit=limit, skip=offset, sort=sort, with_index=True)

    def get_count(self, filter={}, **kwargs):
        return self.dao.get_count(self.dao.pipeline, filter=filter)

    def aggregate(self, operations, filter=None, limit=None, skip=None, sort=None, with_index=False):
        result = self.dao.aggregate(operations, filter, limit, skip, sort)  # TODO: init_filter.
        if with_index and False:
            index = skip + 1 if skip is not None else 1

            for item in result:
                item["index"] = index
                index += 1

        return result

    def add(self, item, with_return=True):
        return self.dao.add(item, with_return=with_return)

    def delete(self, id):
        x = self.dao.delete_by_id(id)
        print(111, x)

        return x

    def update(self, id, item, with_return=True):
        return self.dao.update_by_id(id, item, with_return=with_return)