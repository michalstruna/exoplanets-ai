from flask import request
from flask_socketio import join_room, leave_room

from utils import time
from constants.Discovery import ProcessState


class SocketService:

    def __init__(self, sio):
        self.sio = sio
        self.clients = {}
        self.webs = {}

        @sio.on("client_connect")
        def client_connect(device):
            join_room("clients")
            self.clients[request.sid] = device
            process = {"id": request.sid, **device}
            sio.emit("connected", room=request.sid)
            sio.emit("client_connect", process, room="webs")

            time.sleep(1000)
            self.clients[request.sid]["state"] = ProcessState.ACTIVE.value
            sio.emit("update_client", (process["id"], self.clients[process["id"]]), room="webs")

        @sio.on("disconnect")
        def disconnect():
            client_id = request.sid

            if client_id in self.clients:
                leave_room("clients")
                client = self.clients[client_id]

                if client["state"] != ProcessState.PAUSED.value:
                    client["pause_start"] = time.now()

                client["state"] = ProcessState.TERMINATED.value
                sio.emit("update_client", (client_id, client), room="webs")
                del self.clients[client_id]

        @sio.on("web_connect")
        def web_init(data):
            join_room("webs")
            self.webs[request.sid] = data
            clients = list(map(lambda kv: {"id": kv[0], **kv[1]}, self.clients.items()))
            sio.emit("clients_update", clients)

        @sio.on("web_pause_client")
        def web_pause_client(client_id):
            time.sleep(1000)
            # TODO: ...

            client = self.clients[client_id]
            client["state"] = ProcessState.PAUSED.value
            client["pause_start"] = time.now()
            sio.emit("update_client", (client_id, client), room="webs")
            sio.emit("pause", room=client_id)

        @sio.on("web_resume_client")
        def web_resume_client(client_id):
            time.sleep(1000)
            # TODO: ...

            client = self.clients[client_id]
            client["state"] = ProcessState.ACTIVE.value
            client["pause_total"] += time.now() - client["pause_start"]
            client["pause_start"] = None
            sio.emit("update_client", (client_id, client), room="webs")
            sio.emit("resume", room=client_id)

        @sio.on("web_terminate_client")
        def web_terminate_client(client_id):
            time.sleep(1000)
            sio.emit("terminate", room=client_id)