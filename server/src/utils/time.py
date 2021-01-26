import time as native
from datetime import date, timedelta


def now():
    return round(native.time() * 1000)


def sleep(ms):
    native.sleep(ms / 1000)


def day(before=0):
    return str(date.today() + timedelta(days=before))