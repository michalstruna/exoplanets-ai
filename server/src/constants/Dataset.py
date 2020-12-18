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
        "surface_temperature": {"type": int},
        "ra": {"type": float},
        "dec": {"type": float},
        "apparent_magnitude": {"type": float},
        "distance": {"type": float},
        "metallicity": {"type": float}
    }