#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

server=0
web=0
client=0

if [ $# -eq 0 ]; then
    server=1
    web=1
    client=1
else
    while (( $# >= 1 )); do 
        case $1 in
        --server) server=1;;
        --web) web=1;;
        --client) client=1;;
        *) break;
        esac;
        shift
    done
fi
