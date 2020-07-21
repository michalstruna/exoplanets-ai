from enum import Enum


class ProcessState(Enum):
    PAUSED = 0
    ACTIVE = 1
    TERMINATED = 2
    WAITING_FOR_RESUME = 3
    WAITING_FOR_PAUSE = 4
    WAITING_FOR_TERMINATE = 5
