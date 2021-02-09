#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../client
python3 -m pip install -r requirements.txt

# TODO: Build exe and sh files.