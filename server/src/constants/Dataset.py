from enum import Enum


class DatasetType(Enum):
    STAR_PROPERTIES = "STAR_PROPERTIES"
    TARGET_PIXEL = "TARGET_PIXEL"
    LIGHT_CURVE = "LIGHT_CURVE"


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


class DatasetPriority(Enum):
    LOWEST = 1
    LOW = 2
    NORMAL = 3
    HIGH = 4
    HIGHEST = 5
