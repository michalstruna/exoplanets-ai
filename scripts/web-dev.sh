#!/bin/bash

export ENV=dev
cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../web
npm start