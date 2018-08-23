#!/bin/bash

# Package the static resources into target, and set them up with the URL for local execution.

SOURCE_DIR=src/main/resources/static
TARGET_DIR=target/static
REAL_URL=https://294csan61i.execute-api.us-east-1.amazonaws.com/Prod
DEV_URL=http://127.0.0.1:3000
mkdir -p ${TARGET_DIR}
cp -r ${SOURCE_DIR}/* ${TARGET_DIR}/
grep -rl ${REAL_URL} ${TARGET_DIR} | xargs sed -i '' "s~${REAL_URL}~${DEV_URL}~g"
