from datetime import date, timedelta

from .Base import Service
import db


class GlobalStatsService(Service):

    def __init__(self):
        super().__init__(db.global_stats_dao)

    def get_aggregated(self):
        days_before = 7
        date_before = date.today() - timedelta(days=days_before)

        before = self.extract(self.dao.get_all(init_filter={"date": {"$lt": str(date_before)}}, with_index=False))
        now = self.extract(self.dao.get_all(with_index=False))

        return self.get_with_diff(now, before)

    def get_with_diff(self, now, before):
        result = {}

        for prop in now:
            result[prop] = {"value": now[prop], "diff": now[prop] - before[prop]}

        return result

    def extract(self, arr):
        if arr:
            return arr[0]

        return {"_id": 1, "planets": 0, "volunteers": 0, "hours": 0, "stars": 0, "gibs": 0, "curves": 0}

    def add(self, **kwargs):
        updated = {"inc__stats__hours": 0, "inc__stats__gibs": 0}
        today = str(date.today())

        for prop in kwargs:
            updated["inc__stats__" + prop] = kwargs[prop]

        if "inc__stats__ms" in updated:
            updated["inc__stats__hours"] += updated["inc__stats__ms"] / 3600000
            del updated["inc__stats__ms"]

        if "inc__stats__bytes" in updated:
            updated["inc__stats__gibs"] += updated["inc__stats__bytes"] / 1024**3
            del updated["inc__stats__bytes"]

        self.dao.update({"date": today}, updated, upsert=True, with_return=False)
