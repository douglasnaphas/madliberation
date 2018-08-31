#!/bin/bash

# Package the static resources into target, and set them up with the URLs for local execution.

REAL_URL=https://294csan61i.execute-api.us-east-1.amazonaws.com/Prod
DEV_URL=http://127.0.0.1:3000
REAL_JS_IMPORT='<script src="https://madliberationgame.com/'
DEV_JS_IMPORT='<script src="./'
REAL_CALLBACK='https://madliberationfederated.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=6ktt0mtpks03r8sfticc3h1o6&redirect_uri=https://madliberationgame.com/pick-script.html'
DEV_CALLBACK='https://madliberationfederated.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=6ktt0mtpks03r8sfticc3h1o6&redirect_uri=file:///Users/douglasnaphas/repos/madliberation/target/static/pick-script.html'
REAL_REDIRECT=redirect_uri=https://madliberationgame.com/pick-script.html
DEV_REDIRECT=redirect_uri=file:///Users/douglasnaphas/repos/madliberation/target/static/pick-script.html
subs=( "${REAL_URL}"       "${DEV_URL}"       \
       "${REAL_JS_IMPORT}" "${DEV_JS_IMPORT}" )
SOURCE_DIR=src/main/resources/static
TARGET_DIR=target/static
mkdir -p ${TARGET_DIR}
cp -r ${SOURCE_DIR}/* ${TARGET_DIR}/
COLS=2
for i in $(seq 0 $(expr ${#subs[@]} / ${COLS} - 1))
do
	reali="$((i * COLS))"
	devi="$((reali + 1))"
	real="${subs[${reali}]}"
	dev="${subs[${devi}]}"
	export LC_ALL=C
	grep -rl "${real}" "${TARGET_DIR}" | xargs sed -i '' "s~${real}~${dev}~g"
done
