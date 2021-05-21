from utils.patterns import Enum

class FileType(Enum):
    LC = "lc"
    GV = "gv"
    LV = "lv"
    AVATAR = "avatar"
    STATS = "stats"

class ContentType(Enum):
    PNG = "image/png"
    SVG = "image/svg+xml"