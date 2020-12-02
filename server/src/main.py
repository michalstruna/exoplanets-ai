#!/usr/bin/python3

from app_factory import create_app

# TODO: Dev vs prod env variable.
app, api, sio = create_app("dev")

sio.run(app)