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


class StarType(Enum):
    YELLOW_DWARF = "yellow_dwarf"
    WHITE_DWARF = "white_dwarf"
    RED_DWARF = "red_dwarf"
    BROWN_DWARF = "brown_dwarf"


class SpectralClass(Enum):
    O = "O"
    B = "B"
    A = "A"
    F = "F"
    G = "G"
    K = "K"
    M = "M"
