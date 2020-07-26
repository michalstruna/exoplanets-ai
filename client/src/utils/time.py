import time as native


def now():
    return round(native.time() * 1000)
