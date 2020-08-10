from enum import Enum


class LiveType(Enum):
    IMPOSSIBLE = "impossible"
    POSSIBLE = "possible"
    UNKNOWN = "unknown"
    PROMISING = "promising"
