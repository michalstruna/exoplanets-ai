from utils.patterns import Enum


class PlanetRanks(Enum):
    LATEST = "latest"
    SIMILAR = "similar"
    NEAREST = "nearest"