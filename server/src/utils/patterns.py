from enum import Enum as NativeEnum


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class Enum(NativeEnum):

    @classmethod
    def values(cls):
        return list(map(lambda c: c.value, cls))