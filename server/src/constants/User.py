from utils.patterns import Enum


class UserRole(Enum):

    UNAUTH = 0
    AUTH = 1
    ADMIN = 2

    MYSELF = -1
