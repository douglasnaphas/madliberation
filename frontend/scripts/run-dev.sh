#!/usr/bin/env bash
if ! docker version &>/dev/null
then
    echo 'Could not run `docker version`. Is the Docker daemon running?'
    exit 2
fi
# Make sure mkcert is set up
docker compose up