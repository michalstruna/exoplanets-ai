import json

import db


class Service:

    def __init__(self):
        self.db = db

    def json(self, queryset):
        return json.loads(queryset.to_json())