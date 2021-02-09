#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../web
./node_modules/serve/bin/serve.js -s build