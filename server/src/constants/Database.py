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


class StarSize(Enum):
    DWARF = "dwarf"
    SUBGIANT = "subgiant"
    GIANT = "giant"
    SUPERGIANT = "supergiant"
    HYPERGIANT = "hypergiant"


class SpectralClass(Enum):
    O = "O"
    B = "B"
    A = "A"
    F = "F"
    G = "G"
    K = "K"
    M = "M"


class SpectralSubclass(Enum):
    ZERO = "0"
    ONE = "1"
    TWO = "2"
    THREE = "3"
    FOUR = "4"
    FIVE = "5"
    SIX = "6"
    SEVEN = "7"
    EIGHT = "8"
    NINE = "9"


class LuminosityClass(Enum):
    ZERO = "0"
    I = "I"
    II = "II"
    III = "III"
    IV = "IV"
    V = "V"
    VI = "VI"
    VII = "VII"


class LuminositySubclass(Enum):
    A = "a"
    AB = "ab"
    B = "b"
