#!/bin/bash

mvn package shade:shade -P local
diff template.yml <(awk  '! /CodeUri:/' dev-test-template.yml) &> /dev/null || \
	awk '! /CodeUri:/' dev-test-template.yml > template.yml
sam local start-api -t ~/repos/madliberation/dev-test-template.yml
