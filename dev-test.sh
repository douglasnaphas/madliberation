#!/bin/bash

mvn package shade:shade -P local
sam local start-api -t ~/repos/madliberation/dev-test-template.yml
