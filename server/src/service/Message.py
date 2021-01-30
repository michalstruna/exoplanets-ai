import db
from service.Base import Service

class MessageService(Service):

    def __init__(self):
        super().__init__(db.message_dao)
