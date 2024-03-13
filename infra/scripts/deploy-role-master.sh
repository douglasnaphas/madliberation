#!/bin/bash

set -e
STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix role-master);
npx cdk deploy ${STACKNAME};
