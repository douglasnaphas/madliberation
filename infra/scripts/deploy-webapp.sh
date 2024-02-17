#!/bin/bash

set -e
STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix webapp);
npx cdk deploy --require-approval never ${STACKNAME};
