from abc import ABC

from mongoengine import DoesNotExist


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
        return self.dao.aggregate(operations, filter, limit, skip, sort)  # TODO: init_filter.

    def add(self, item, with_return=True):
        return self.dao.add(item, with_return=with_return)

    def delete(self, id):
        return self.dao.delete_by_id(id)

    def update(self, id, item, with_return=True):
        return self.dao.update_by_id(id, item, with_return=with_return)

    def update_array_items(self, array_name, field_name, old_field_value, new_field_value):
        self.dao.collection._get_collection().update_many(
            {},
            {"$set": {f"{array_name}.$[current].{field_name}": new_field_value}},
            array_filters=[{f"current.{field_name}": old_field_value}]
        )

    def delete_array_items(self, array_name, field_name, field_value):
        self.dao.collection._get_collection().update_many({}, {"$pull": {array_name: {field_name: field_value}}})

    def check_selection(self, item, selection):
        for category in selection:
            if category not in item or type(item[category]) != list:
                raise DoesNotExist(f"Invalid selection: Category \"{category}\" does not exist.")

            for selection_item in selection[category]:
                if not list(filter(lambda x: x["dataset"] == selection_item, item[category])):
                    raise DoesNotExist(f"Invalid selection: Dataset \"{selection_item}\" does not exist in \"{category}\".")