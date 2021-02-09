#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

. ./argparser.sh

if [ $server -eq 1 ]; then
    ./server-build.sh
fi

if [ $web -eq 1 ]; then
    ./web-build.sh
fi

if [ $client -eq 1 ]; then
    ./client-build.sh
fi