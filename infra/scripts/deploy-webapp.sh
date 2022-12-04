#!/bin/bash

set -e
npx cdk bootstrap;
STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix webapp);
npx cdk deploy --require-approval never ${STACKNAME};
