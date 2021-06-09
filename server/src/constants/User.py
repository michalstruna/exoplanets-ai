from utils.patterns import Enum


class UserRole(Enum):
    UNAUTH = 0
    AUTH = 1
    MOD = 2
    ADMIN = 3

class EndpointAuth(Enum):
    ANY = 0
    MYSELF = 1
    MYSELF_OR_MOD = 1
    MYSELF_OR_ADMIN = 2


class Sex(Enum):
    MALE = "M"
    FEMALE = "F"

    @classmethod
    def get_by_name(cls, name):
        if type(name) != str:
            return None

        sex = name.lower()

        if sex in ["f", "female"]:
            return Sex.FEMALE.value

        if sex in ["m", "male"]:
            return Sex.MALE.value
