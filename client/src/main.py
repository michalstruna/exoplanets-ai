#!/usr/bin/python3

import webbrowser
from service import Socket

sio = Socket.sio

webbrowser.open(f"http://localhost:3000/sync/{sio.eio.sid}")  # TODO: From config.