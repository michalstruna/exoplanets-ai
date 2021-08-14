from http import HTTPStatus
from flask import Flask, jsonify
from flask_socketio import SocketIO
from mongoengine import connect
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from api import api
from api.sockets import Sockets
from constants.Error import ErrorType


def create_app(config_name=None):
    app = Flask(__name__, static_folder="../public", static_url_path="/public")
    CORS(app)
    jwt = JWTManager(app)
    app.config.from_pyfile("config/base.cfg", silent=True)

    @jwt.unauthorized_loader
    def unauthorized_loader(jwt_header=None, jwt_payload=None):
        return jsonify(type=ErrorType.UNAUTHORIZED.value, message="Unauthorized request."), HTTPStatus.UNAUTHORIZED


    if config_name is not None:
        app.config.from_pyfile(f"config/{config_name}.cfg")

    db = connect(app.config["DATABASE_NAME"], host=app.config["DATABASE_HOST"])

    if app.config["TESTING"]:
        db.drop_database(app.config["DATABASE_NAME"])

    api.init_app(app, doc="/api-docs")
    socketio = SocketIO(app, cors_allowed_origins="*")
    Sockets(socketio)

    return app, api, socketio