#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

. ./argparser.sh

if [ $server -eq 1 ]; then
    x-terminal-emulator -e mongod
    x-terminal-emulator -e ./server-run.sh
fi

if [ $web -eq 1 ]; then
    x-terminal-emulator -e ./web-run.sh
fi

if [ $client -eq 1 ]; then
    x-terminal-emulator -e ./client-run.sh
fi
