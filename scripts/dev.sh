#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

. ./argparser.sh

if [ $server -eq 1 ]; then
    x-terminal-emulator -e mongod
    x-terminal-emulator -e ./server-dev.sh
fi

if [ $web -eq 1 ]; then
    x-terminal-emulator -e ./web-dev.sh
fi

if [ $client -eq 1 ]; then
    x-terminal-emulator -e ./client-dev.sh
fi
