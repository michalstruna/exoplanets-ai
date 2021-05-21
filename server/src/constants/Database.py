from utils.patterns import Enum


class PlanetType(Enum):
    MERCURY = "mercury"
    EARTH = "earth"
    SUPEREARTH = "superearth"
    NEPTUNE = "neptune"
    JUPITER = "jupiter"


class PlanetStatus(Enum):
    CANDIDATE = "candidate"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"


class LifeType(Enum):
    IMPOSSIBLE = "impossible"
    POSSIBLE = "possible"
    UNKNOWN = "unknown"
    PROMISING = "promising"
