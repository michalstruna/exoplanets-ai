#!/usr/bin/python3

import os

from app_factory import create_app

app, api, sio = create_app(os.getenv("ENV"))

sio.run(app)