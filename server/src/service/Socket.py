class SocketService():

    sio = None

    def get_room_name(self, user_id, target):
        return (user_id if user_id else "") + "/" + target

    def emit(self, event, *data, id=None, user=None, targets=["clients", "webs"]):
        rooms = [id] if id else list(map(lambda target: self.get_room_name(user, target), targets))

        for room in rooms:
            self.sio.emit(event, *data, room=room)

    def emit_client(self, event, *data, id=None, user=None):
        self.emit(event, *data, id=id, user=user, targets=["clients"])

    def emit_web(self, event, *data, id=None, user=None):
        self.emit(event, *data, id=id, user=user, targets=["webs"])
