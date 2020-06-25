import json

import db


class Service:

    def __init__(self):
        self.db = db

    def json(self, queryset):
        return json.loads(queryset.to_json())

    def aggregate(self, model, operations, filter={}, limit=None, skip=None):
        pipeline = [{"$match": filter}]

        if limit:
            pipeline.append({"$limit": limit})

        if skip:
            pipeline.append({"$skip": skip})

        pipeline += operations

        return list(model.objects.aggregate(pipeline))