#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../server
python3 -m pip install -r requirements.txt