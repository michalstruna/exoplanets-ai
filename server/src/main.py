#!/usr/bin/python3

from app_factory import create_app

# TODO: Dev vs prod env variable.
app, api, socketio = create_app("dev")
socketio.run(app)

map_web_to_client = {}

@socketio.on("web_init")
def web_init():
    pass


@socketio.on("client_init")
def client_init():
    pass