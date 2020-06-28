#!/usr/bin/python3

from app_factory import create_app
from flask import request

# TODO: Dev vs prod env variable.
app, api, sio = create_app("dev")


@sio.on("connect")
def connect():
    print("=========================", "connected")
    sio.emit("connect_success")


@sio.on("disconnect")
def disconnect():
    print("=========================", "disconnected")


@sio.on("client_init")
def client_init():
    print("=================== client_init")


sio.run(app)