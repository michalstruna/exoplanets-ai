import db
from service.Base import Service
from service.Socket import SocketService

class MessageService(Service):

    def __init__(self):
        super().__init__(db.message_dao)
        self.socket_service = SocketService()

    def add(self, item, with_return=True):
        result = super().add(item, with_return)
        self.socket_service.emit_web("new_message", result)
        return result
