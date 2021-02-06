from flask import request
from flask_socketio import join_room, leave_room

from utils.patterns import Singleton
from service.Socket import SocketService
from constants.Database import PlanetStatus
from constants.Discovery import ProcessState
from service.Stats import GlobalStatsService
from service.Dataset import DatasetService
from service.Planet import PlanetService
from service.Star import StarService
from service.File import FileService
from service.User import UserService
from utils import time


class Sockets(metaclass=Singleton):

    def __init__(self, sio):
        self.sio = sio
        self.clients = {}
        self.webs = {}
        self.users = {}
        
        self.dataset_service = DatasetService()
        self.star_service = StarService()
        self.planet_service = PlanetService()
        self.user_service = UserService()
        self.tasks = {}
        self.file_service = FileService()
        self.stats_service = GlobalStatsService()

        SocketService.sio = sio
        self.socket_service = SocketService()

        @sio.on("web_connect")
        def web_connect():
            self.webs[request.sid] = {"id": request.sid}  # Create new web.
            self.socket_service.emit_web("set_online_users", list(self.users.values()), id=request.sid)
            join_room(self.socket_service.get_room_name(None, "webs"))  # Join to room with all webs.

        @sio.on("web_auth")
        def web_auth(user_id):
            if request.sid not in self.webs:  # If web does not exist.
                web_connect()  # Create web.

            web = self.webs[request.sid]
            web["user_id"] = user_id  # Assign user to web.

            if user_id not in self.users:  # If user does not exist.
                self._add_user(user_id, webs=request.sid)  # Create user.

            user = self.users[user_id]

            clients = list(map(lambda client_id: self.clients[client_id], user["clients"]))
            self.socket_service.emit_web("clients_update", clients, id=request.sid)  # Send info to new web about all connected clients of user.
            join_room(self.socket_service.get_room_name(user_id, "webs"))  # Join web to room with user's webs and all webs.

        @sio.on("web_unauth")
        def web_unauth():
            web = self.webs[request.sid]
            user = self.users[web["user_id"]]
            leave_room(self.socket_service.get_room_name(user["id"], "webs"))  # Leave room of user's webs.
            self._remove_user_if_empty(user["id"], webs=web["id"])

        @sio.on("web_disconnect")
        def web_disconnect():
            web = self.webs[request.sid]
            leave_room(self.socket_service.get_room_name(None, "webs"))  # Leave room of all webs.

            if "user_id" in web:  # If it is authenticated web.
                web_unauth()

        @sio.on("client_connect")
        def client_connect(client):
            self.clients[request.sid] = {"id": request.sid, **client}  # Create new client.
            join_room(self.socket_service.get_room_name(None, "clients"))

        @sio.on("client_auth")
        def client_auth(client_id):
            client = self.clients[client_id]
            user = self.users[self.webs[request.sid]["user_id"]]
            user["clients"].append(client_id)
            client["user_id"] = user["_id"]
            join_room(self.socket_service.get_room_name(user["_id"], "clients"))
            self.socket_service.emit_web("client_auth", client, user=user["_id"])

        @sio.on("client_disconnect")
        def client_disconnect():
            client = self.clients[request.sid]
            leave_room(self.socket_service.get_room_name(None, "clients"))  # Leave room of all clients.

            if "user_id" in client:  # Client was already authenticated.
                self._remove_user_if_empty(client["user_id"], clients=client["id"])
                leave_room(self.socket_service.get_room_name(client["user_id"], "webs"))  # Leave room of user's webs.
                self.emit_web("client_disconnect", request.sid, user=client["user_id"])
                # TODO: If interrupted, restore item to dataset.
                # TODO: Emit web auth/disconnect client.

            del self.clients[client["id"]]






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
            self.socket_service.emit_client("terminate", id=client_id)

        @sio.on("client_log")
        def client_log(log):
            client = self.clients[request.sid]
            client["data"]["logs"].insert(0, log)
            self.socket_service.emit_web("client_log", {**log, "client_id": request.sid}, user=client["user_id"])

        @sio.on("client_submit_task")
        def client_submit_task(task):
            self.pause_client(request.sid)

            self.stats_service.add(
                curves=1,
                bytes=task["meta"]["size"],
                ms=ms,
                planets=planets,
                stars=stars
            )

            self.finish_task(task)
            self.add_task(request.sid)

    def _add_user(self, user_id, **kwargs):
        if user_id not in self.users:
            user = self.user_service.update(user_id, {"online": True})
            user = {"clients": [], "webs": [], "id": user_id, **user}
            self.users[user_id] = user

            for k in kwargs:
                user[k].append(kwargs[k])

            self.socket_service.emit_web("add_online_user", user)
        else:
            user = self.users[user_id]

            for k in kwargs:
                user[k].append(kwargs[k])

            self.socket_service.emit_web("update_online_user", user["id"], user)

    def _remove_user_if_empty(self, user_id, **kwargs):
        user = self.users[user_id]

        for k in kwargs:
            user[k].remove(kwargs[k])

        if not user["webs"] and not user["clients"]:
            del self.users[user_id]
            self.user_service.update(user_id, {"online": False})
            self.socket_service.emit_web("remove_online_user", user_id)
        else:
            self.socket_service.emit_web("update_online_user", user)






    def remove_client(self):
        pass

    def update_client(self, id):
        client = self.clients[id]
        user_id, client = client["user_id"], client["data"]
        update = {**client}
        del update["logs"]
        self.socket_service.emit_web("update_client", update, user=user_id)

    def pause_client(self, client_id):
        client, user_id = self.clients[client_id]["data"], self.clients[client_id]["user_id"]
        client["state"] = ProcessState.PAUSED.value

        if not client["pause_start"]:
            client["pause_start"] = time.now()

        self.socket_service.emit_web("update_client", client, user=user_id)
        self.socket_service.emit_client("pause", id=client_id)

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
            self.socket_service.emit_client("run", task, id=client_id)
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
