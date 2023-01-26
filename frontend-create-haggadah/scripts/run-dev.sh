#!/usr/bin/env bash
if ! docker version &>/dev/null
then
    echo 'Could not run `docker version`. Is the Docker daemon running?'
    exit 2
fi
# Make sure mkcert is set up
for MKCERT_FILE in localhost{,-key}.pem
do
    if [[ ! -f ${MKCERT_FILE} ]]
    then
        echo ${MKCERT_FILE} 'must exist in the frontend-create-haggadah/ directory.'
        echo 'Make sure you have run `mkcert -install ; mkcert localhost`, to set'
        echo 'up TLS for localhost. See https://github.com/FiloSottile/mkcert.'
        exit 3
    fi
done
docker compose up