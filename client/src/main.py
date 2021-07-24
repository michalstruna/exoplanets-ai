#!/usr/bin/python3

import webbrowser

from constants import Config
from service import Socket

sio = Socket.sio

webbrowser.open(f"{Config.WEB_URL}/sync/{sio.sid}")