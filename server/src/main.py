#!/usr/bin/python3

import os

from app_factory import create_app

app, api, sio = create_app(os.getenv("ENV"))

from service.Stats import GlobalStatsService
from threading import Timer

def initialize():
    global_stats = GlobalStatsService()
    global_stats.update_planets()

timer = Timer(3, initialize)
timer.start()

sio.run(app)


