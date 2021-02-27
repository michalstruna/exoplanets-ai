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
        def web_connect(user_id=None):
            self.webs[request.sid] = {"id": request.sid}  # Create new web.
            self.socket_service.emit_web("set_online_users", list(self.users.values()), id=request.sid)
            join_room(self.socket_service.get_room_name(None, "webs"))  # Join to room with all webs.

            if user_id:
                web_auth(user_id)

        @sio.on("web_auth")
        def web_auth(user_id):
            if request.sid not in self.webs:  # If web does not exist.
                web_connect()  # Create web.

            web = self.webs[request.sid]
            web["user_id"] = user_id  # Assign user to web.
            self._add_user(user_id, webs=request.sid)  # Create or update user.
            user = self.users[user_id]

            clients = list(map(lambda client_id: self.clients[client_id], user["clients"]))
            self.socket_service.emit_web("clients_update", clients, id=request.sid)  # Send info to new web about all connected clients of user.

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

        @sio.on("disconnect")
        def disconnect():
            if request.sid in self.clients:
                client = self.clients[request.sid]
                leave_room(self.socket_service.get_room_name(None, "clients"))  # Leave room of all clients.

                if "user_id" in client:  # Client was authenticated.
                    user = self.users[client["user_id"]]
                    self._remove_user_if_empty(client["user_id"], clients=client["id"])
                    leave_room(self.socket_service.get_room_name(client["user_id"], "webs"))  # Leave room of user's webs.
                    self.socket_service.emit_web("client_unauth", request.sid, user=client["user_id"])
                    # TODO: If interrupted, restore item to dataset.
                    # TODO: Emit web auth/disconnect client.

                    del self.clients[client["user_id"]]
                    user.clients.remove(client["id"])
                    self.socket_service.emit_web("update_online_user", user["id"], user)

        @sio.on("client_connect")
        def client_connect(client):
            self.clients[request.sid] = {"id": request.sid, **client}  # Create new client.
            join_room(self.socket_service.get_room_name(None, "clients"))

        @sio.on("client_auth")
        def client_auth(client_id):
            client = self.clients[client_id]
            user = self.users[self.webs[request.sid]["user_id"]]
            client["user_id"] = user["_id"]
            self.socket_service.emit_web("client_auth", client, user=user["_id"])
            self._add_user(client["user_id"], clients=client_id)
            self._add_task(client_id)




        # TODO: Fix web-client controls.
        @sio.on("web_pause_client")
        def web_pause_client(client_id):
            time.sleep(1000)
            self.pause_client(client_id)

        @sio.on("web_run_client")
        def web_run_client(client_id):
            time.sleep(1000)
            self._add_task(client_id)

        @sio.on("web_terminate_client")
        def web_terminate_client(client_id):
            time.sleep(1000)
            self.socket_service.emit_client("terminate", id=client_id)




        @sio.on("client_log")
        def client_log(log):
            client = self.clients[request.sid]
            client["logs"].insert(0, log)
            self.socket_service.emit_web("client_log", {**log, "client_id": request.sid}, user=client["user_id"])

        @sio.on("client_submit_task")
        def client_submit_task(task):
            self.pause_client(request.sid)
            self.finish_task(task)
            self._add_task(request.sid)

    def _add_user(self, user_id, **kwargs):
        if user_id not in self.users:
            user = self.user_service.update(user_id, {"online": True})
            user = {"clients": [], "webs": [], "id": user_id, **user}
            self.users[user_id] = user

            for k in kwargs:
                user[k].append(kwargs[k])
                join_room(self.socket_service.get_room_name(user["_id"], k))

            self.socket_service.emit_web("add_online_user", user)
        else:
            user = self.users[user_id]

            for k in kwargs:
                user[k].append(kwargs[k])
                join_room(self.socket_service.get_room_name(user["_id"], k))

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
            self.socket_service.emit_web("update_online_user", user_id, user)

    



    def pause_client(self, client_id):
        # TODO: Wait for pause.
        client = self.clients[client_id]
        client["state"] = ProcessState.PAUSED.value

        if not client["pause_start"]:
            client["pause_start"] = time.now()

        self.socket_service.emit_web("update_client", client, user=client["user_id"])
        self.socket_service.emit_client("pause", id=client_id)

    def _add_task(self, client_id):
        """
        Add task to client with specified id.
        """
        client = self.clients[client_id]

        try:
            task = self.dataset_service.get_task()

            if client["state"] != ProcessState.ACTIVE.value:
                client["state"] = ProcessState.ACTIVE.value
                client["pause_total"] = time.now() - client["pause_start"]
                client["pause_start"] = None

            self.socket_service.emit_web("update_client", client, user=client["user_id"])
            self.socket_service.emit_client("run", task, id=client_id)
        except:
            pass  # TODO: Wait for new item.

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

        dataset = self.dataset_service.update(task["dataset_id"], {})#{"pop__items": -1})  # TODO: Pop item.
        light_curve = task["solution"]["light_curve"]
        stars, planets = 0, 0

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

        stats = {"items": 1, "data": task["meta"]["size"], "time": ms, "planets": len(task["solution"]["transits"])}
        self.dataset_service.add_stats(task["dataset_id"], **stats)
        self.user_service.add_stats(self.clients[request.sid]["user_id"], **stats)
        stats["planets"], stats["stars"] = planets, stars
        self.stats_service.add(**stats)

