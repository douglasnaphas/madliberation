#!/bin/bash

mvn package shade:shade
diff template.yml <(awk  '! /CodeUri:/' dev-test-template.yml) &> /dev/null || \
	awk '! /CodeUri:/' dev-test-template.yml > template.yml
sam local start-api --template ~/repos/madliberation/dev-test-template.yml --port 3001
