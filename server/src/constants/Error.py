from utils.patterns import Enum


class ErrorType(Enum):

    NOT_FOUND = "NOT_FOUND"
    DUPLICATE = "DUPLICATE"
    INVALID = "INVALID"
    BAD_CREDENTIALS = "BAD_CREDENTIALS"
    BAD_REQUEST = "BAD_REQUEST"