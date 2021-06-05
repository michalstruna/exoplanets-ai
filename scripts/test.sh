#!/bin/bash

cd "$(dirname "$0")"

. ./argparser.sh
cd ..

if [ $server -eq 1 ]; then
    pytest server
fi

if [ $web -eq 1 ]; then
    echo "No tests."
fi

if [ $client -eq 1 ]; then
    echo "No tests."
fi
