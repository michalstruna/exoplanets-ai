from utils.patterns import Enum

class MessageTag(Enum):
    MESSAGE = "message"
    NEW_VOLUNTEER = "new_volunteer"
    NEW_PLANET = "new_planet",
    NEW_DATASET = "new_dataset"