import time as native


def now():
    return round(native.time() * 1000)


def sleep(ms):
    native.sleep(ms / 1000)