from flask import request
from flask_socketio import join_room, leave_room

from utils import time, patterns
from constants.Discovery import ProcessState


class SocketService(metaclass=patterns.Singleton):

    def __init__(self, sio):
        self.sio = sio
        self.clients = {}
        self.webs = {}
        self.users = {}

        @sio.on("client_connect")
        def client_connect(client):
            client = self.add_client(client, "user_id")

            self.emit_client("connected", id=request.sid)
            self.emit_web("client_connect", client, user="user_id")

            sio.sleep(1)  # TODO: Sleep not working.
            self.next_task(client["id"])

        @sio.on("disconnect")
        def disconnect():
            id = request.sid

            if id in self.clients:
                client = self.clients[id]
                user_id, client = client["user_id"], client["data"]

                if not client["pause_start"]:
                    client["pause_start"] = time.now()

                client["state"] = ProcessState.TERMINATED.value
                self.emit_web("update_client", client, user=user_id)

                leave_room(self._get_room_name(None, "clients"))
                leave_room(self._get_room_name(user_id, "clients"))
                self.users[user_id]["clients"].remove(id)
                del self.clients[id]
            elif id in self.webs:
                pass  # TODO

        @sio.on("web_connect")
        def web_connect():
            self.add_web("user_id")
            clients = list(map(lambda client_id: self.clients[client_id]["data"], self.users["user_id"]["clients"]))
            self.emit_web("clients_update", clients, user="user_id")

        @sio.on("web_pause_client")
        def web_pause_client(client_id):
            time.sleep(1000)
            # TODO: ...

            client, user_id = self.clients[client_id]["data"], self.clients[client_id]["user_id"]
            client["state"] = ProcessState.PAUSED.value

            if not client["pause_start"]:
                client["pause_start"] = time.now()

            self.emit_web("update_client", client, user=user_id)
            self.emit_client("pause", id=client_id)

        @sio.on("web_run_client")
        def web_run_client(client_id):
            time.sleep(1000)
            self.next_task(client_id)

        @sio.on("web_terminate_client")
        def web_terminate_client(client_id):
            time.sleep(1000)
            self.emit_client("terminate", id=client_id)

    def next_task(self, client_id):
        client, user_id = self.clients[client_id]["data"], self.clients[client_id]["user_id"]

        if True:  # If there is data to process:
            client["state"] = ProcessState.ACTIVE.value
            client["pause_total"] = time.now() - client["pause_start"]
            client["pause_start"] = None

            self.emit_web("update_client", client, user=user_id)
            self.emit_client("run", id=client_id)
        else:
            pass

    def _add_user(self, user_id):
        if user_id not in self.users:
            self.users[user_id] = {"clients": [], "webs": [], "id": user_id}

    def _get_room_name(self, user_id, target):
        return (user_id if user_id else "") + "/" + target

    def _remove_user(self, user_id):
        del self.users[user_id]

    def add_client(self, client, user_id):
        client_id = request.sid
        client = {"id": client_id, **client}

        self._add_user(user_id)
        self.users[user_id]["clients"].append(client_id)
        self.clients[client_id] = {"data": client, "user_id": user_id}
        join_room(self._get_room_name(user_id, "clients"))
        join_room(self._get_room_name(None, "clients"))

        return client

    def add_web(self, user_id):
        web_id = request.sid

        self._add_user(user_id)
        self.users[user_id]["webs"].append(web_id)
        self.webs[web_id] = {"user_id": user_id}
        join_room(self._get_room_name(user_id, "webs"))
        join_room(self._get_room_name(None, "webs"))

    def remove_client(self):
        pass

    def remove_web(self):
        pass

    def emit(self, event, *data, id=None, user=None, targets=["clients", "webs"]):
        rooms = [id] if id else list(map(lambda target: self._get_room_name(user, target), targets))

        for room in rooms:
            self.sio.emit(event, *data, room=room)

    def emit_client(self, event, *data, id=None, user=None):
        self.emit(event, *data, id=id, user=user, targets=["clients"])

    def emit_web(self, event, *data, id=None, user=None):
        self.emit(event, *data, id=id, user=user, targets=["webs"])
