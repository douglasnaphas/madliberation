#!/bin/bash

set -e
STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix role-all-branches);
npx cdk deploy ${STACKNAME};
