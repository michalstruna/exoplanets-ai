#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

. ./argparser.sh

if [ $server -eq 1 ]; then
    ./server-test.sh
fi

if [ $web -eq 1 ]; then
    ./web-test.sh
fi

if [ $client -eq 1 ]; then
    ./client-test.sh
fi
