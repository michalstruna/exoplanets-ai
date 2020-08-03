from utils.patterns import Enum


class DatasetType(Enum):
    STAR_PROPERTIES = "STAR_PROPERTIES"
    TARGET_PIXEL = "TARGET_PIXEL"
    LIGHT_CURVE = "LIGHT_CURVE"


class PlanetType(Enum):
    MERCURY = "mercury"
    EARTH = "earth"
    SUPER_EARTH = "super_earth"
    NEPTUNE = "neptune"
    JUPITER = "jupiter"
