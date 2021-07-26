from enum import Enum


class DatasetType(Enum):
    STAR_PROPERTIES = "STAR_PROPERTIES"
    TARGET_PIXEL = "TARGET_PIXEL"
    SYSTEM_NAMES = "SYSTEM_NAMES"


class DatasetFields(Enum):
    STAR_PROPERTIES = {
        "name": {"type": str},
        "diameter": {"type": float},
        "mass": {"type": float},
        "surface_temperature": {"type": float},
        "ra": {"type": float},
        "dec": {"type": float},
        "apparent_magnitude": {"type": float},
        "distance": {"type": float},
        "metallicity": {"type": float}
    }
    TARGET_PIXEL = {
        "name": {"type": str}
    }
    SYSTEM_NAMES = {
        "name1": {"type": str},
        "name2": {"type": str},
        "name3": {"type": str},
        "name4": {"type": str},
        "name5": {"type": str},
        "name6": {"type": str}
    }


class DatasetPriority(Enum):
    LOWEST = 1
    LOW = 2
    NORMAL = 3
    HIGH = 4
    HIGHEST = 5
