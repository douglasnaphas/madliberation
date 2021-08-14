#!/bin/bash

npm run-script build
diff template.yml <(awk  '! /CodeUri:/' dev-test-template.yml) &> /dev/null || \
	awk '! /CodeUri:/' dev-test-template.yml > template.yml
sam local start-api -t ~/repos/madliberationjs/dev-test-template.yml
