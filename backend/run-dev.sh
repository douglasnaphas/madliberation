#!/bin/bash

# Use this to run a Lambda environment locally for development and testing.
# You need to install AWS's SAM CLI first.

sed 's/NODE_ENV: production/NODE_ENV: development/' ./template.yml > ./dev-template.yml
sam local start-api --template ./dev-template.yml --port 3002
