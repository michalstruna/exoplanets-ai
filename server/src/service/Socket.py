from flask import request
from flask_socketio import join_room, leave_room

from constants.Database import PlanetStatus
from service.Stats import GlobalStatsService
from utils import time, patterns
from constants.Discovery import ProcessState
from service.Dataset import DatasetService
from service.Planet import PlanetService
from service.Star import StarService
from service.File import FileService


class SocketService(metaclass=patterns.Singleton):

    def __init__(self, sio):
        self.sio = sio
        self.clients = {}
        self.webs = {}
        self.users = {}
        self.dataset_service = DatasetService()
        self.star_service = StarService()
        self.planet_service = PlanetService()
        self.tasks = {}
        self.file_service = FileService()
        self.stats_service = GlobalStatsService()

        @sio.on("client_connect")
        def client_connect(client):
            client = self.add_client(client, "user_id")

            self.emit_client("connected", id=request.sid)
            self.emit_web("client_connect", client, user="user_id")

            sio.sleep(1)  # TODO: Sleep not working.
            self.add_task(client["id"])

        @sio.on("disconnect")
        def disconnect():
            id = request.sid

            if id in self.clients:
                client = self.clients[id]
                user_id, client = client["user_id"], client["data"]

                if not client["pause_start"]:
                    client["pause_start"] = time.now()

                client["state"] = ProcessState.TERMINATED.value
                self.update_client(id)

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
            self.pause_client(client_id)

        @sio.on("web_run_client")
        def web_run_client(client_id):
            time.sleep(1000)
            self.add_task(client_id)

        @sio.on("web_terminate_client")
        def web_terminate_client(client_id):
            time.sleep(1000)
            self.emit_client("terminate", id=client_id)

        @sio.on("client_log")
        def client_log(log):
            client = self.clients[request.sid]
            client["data"]["logs"].insert(0, log)
            self.emit_web("client_log", {**log, "client_id": request.sid}, user=client["user_id"])

        @sio.on("client_submit_task")
        def client_submit_task(task):
            self.pause_client(request.sid)
            self.finish_task(task)
            self.add_task(request.sid)

    def update_client(self, id):
        client = self.clients[id]
        user_id, client = client["user_id"], client["data"]
        update = {**client}
        del update["logs"]
        self.emit_web("update_client", update, user=user_id)

    def pause_client(self, client_id):
        client, user_id = self.clients[client_id]["data"], self.clients[client_id]["user_id"]
        client["state"] = ProcessState.PAUSED.value

        if not client["pause_start"]:
            client["pause_start"] = time.now()

        self.emit_web("update_client", client, user=user_id)
        self.emit_client("pause", id=client_id)

    def add_task(self, client_id):
        """
        Add task to client with specified id.
        """
        client, user_id = self.clients[client_id]["data"], self.clients[client_id]["user_id"]

        try:
            task = self.dataset_service.get_task()

            if client["state"] != ProcessState.ACTIVE.value:
                client["state"] = ProcessState.ACTIVE.value
                client["pause_total"] = time.now() - client["pause_start"]
                client["pause_start"] = None

            self.update_client(client_id)
            self.emit_client("run", task, id=client_id)
        except:
            pass

    def finish_task(self, task):
        """
        Finish task by client.  # TODO: Another task types?
        """
        lc_plot = self.file_service.save(task["solution"]["light_curve"]["plot"], FileService.Type.LC)
        task["solution"]["light_curve"]["plot"] = lc_plot

        for transit in task["solution"]["transits"]:
            lv_plot = self.file_service.save(transit["local_view"]["plot"], FileService.Type.LV)
            transit["local_view"]["plot"] = lv_plot
            gv_plot = self.file_service.save(transit["global_view"]["plot"], FileService.Type.GV)
            transit["global_view"]["plot"] = gv_plot

        ms = time.now() - task["meta"]["created"]

        updated = {"inc__time": ms, "inc__processed": task["meta"]["size"]} #, "pop__items": -1 }
        dataset = self.dataset_service.update(task["dataset_id"], updated)
        light_curve = task["solution"]["light_curve"]  # TODO: target_pixel

        stars = 0
        planets = 0

        try:
            star = self.star_service.get_by_name(task["item"])
            star = self.star_service.update(star["_id"], {"push__light_curves": light_curve})
        except:
            star = self.star_service.add({"light_curves": [light_curve]})
            stars += 1

        for transit in task["solution"]["transits"]:
            properties = self.planet_service.complete_planet(star, {"name": "KIC a", "transit": transit, "dataset": dataset["name"], "processed": True})
            planet = {"properties": [properties], "status": PlanetStatus.CANDIDATE.value}
            planet = self.planet_service.add(star["_id"], planet)

            if not planet["properties"]:
                planets += 1

        self.stats_service.add(
            curves=1,
            bytes=task["meta"]["size"],
            ms=ms,
            planets=planets,
            stars=stars
        )

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
