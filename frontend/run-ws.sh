#!/usr/bin/env bash
npm install --global ws
ls /
NODE_PATH=/usr/local/lib node -e 'console.log(process.env);'
npm list -g
NODE_PATH=/usr/local/lib/node_modules node /ws.js