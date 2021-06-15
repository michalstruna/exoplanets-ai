#!/bin/bash

cd "$(dirname "$0")"

. ./argparser.sh
cd ..

if [ $server -eq 1 ]; then
    cd server
    python3 -m pip install -r server/requirements.txt
    cd ..
fi

if [ $web -eq 1 ]; then
    cd ../web
    npm i
    npm run build
    cd ..
fi

if [ $client -eq 1 ]; then
    cd client
    python3 -m pip install -r client/requirements.txt
    # TODO: Build exe and sh files.
    cd ..
fi