#!/usr/bin/python3

from flask import Flask
from flask_socketio import SocketIO
from mongoengine import connect

from api import api


def create_app(config_name=None):
    app = Flask(__name__)
    app.config.from_pyfile("config/prod.cfg", silent=True)

    if config_name is not None:
        app.config.from_pyfile(f"config/{config_name}.cfg")

    connect(app.config["DATABASE"])

    return app


# TODO: Dev vs prod env variable.
app = create_app("dev")

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
