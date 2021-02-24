#!/bin/bash

export ENV=dev
cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../server
export ENV=dev && python3 src/main.py