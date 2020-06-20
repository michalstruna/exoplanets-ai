#!/usr/bin/python3

from flask import Flask
from flask_socketio import SocketIO

from api import api

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
app.config["RESTX_MASK_SWAGGER"] = False
app.config['ERROR_404_HELP'] = False

map_web_to_client = {}

api.init_app(app, doc="/api-docs")
socketio = SocketIO(app, cors_allowed_origins="*")  # TODO: Allow only exoplanets-ai.


@socketio.on("web_init")
def web_init():
    pass


@socketio.on("client_init")
def client_init():
    pass


socketio.run(app, debug=True)
