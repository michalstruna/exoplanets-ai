from enum import Enum


class ProcessState(Enum):
    PAUSED = 0
    ACTIVE = 1
    TERMINATED = 2
    WAITING_FOR_PAUSE = 3
    WAITING_FOR_TERMINATE = 4
    WAITING_FOR_RUN = 5


class TaskType(Enum):
    STAR_PROPERTIES = "STAR_PROPERTIES"
    TARGET_PIXEL = "TARGET_PIXEL"
    LIGHT_CURVE = "LIGHT_CURVE"


class LogType(Enum):
    CONNECT = "connect"
    DOWNLOAD_TP = "download_tp",
    BUILD_LC = "build_lc",
    ANALYZE_LC = "analyze_lc"
