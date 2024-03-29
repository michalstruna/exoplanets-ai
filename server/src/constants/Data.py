from enum import Enum


class Relation(Enum):
    EQ = "eq"
    CONT = "cont"
    GT = "gt"
    GTE = "gte"
    LT = "lt"
    LTE = "lte"
    STARTS = "starts"
    ENDS = "ends"


class Store(Enum):
    PLANET_PLOTS = "planet_plots"
    PLANET_RANKS = "planet_ranks"