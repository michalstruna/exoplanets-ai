from flask import Flask
from flask_socketio import SocketIO
from mongoengine import connect
from flask_cors import CORS

from api import api


def create_app(config_name=None):
    app = Flask(__name__)
    CORS(app)
    app.config.from_pyfile("config/base.cfg", silent=True)

    if config_name is not None:
        app.config.from_pyfile(f"config/{config_name}.cfg")

    db = connect(app.config["DATABASE"])

    if app.config["TESTING"]:
        db.drop_database(app.config["DATABASE"])

    api.init_app(app, doc="/api-docs")
    socketio = SocketIO(app, cors_allowed_origins="*")  # TODO: Allow only exoplanets-ai.

    return app, api, socketio