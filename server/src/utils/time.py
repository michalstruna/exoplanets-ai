import time as native
from datetime import date


def now():
    return round(native.time() * 1000)


def sleep(ms):
    native.sleep(ms / 1000)


def today():
    return date.today().strftime('%Y-%m-%d')