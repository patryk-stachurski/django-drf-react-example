#!/usr/bin/env bash

USAGE="Usage: $0 your-domain-name.com"

if [[ ! $1 ]]
then
    echo ${USAGE}
    exit 1
fi

files=$(find init_certbot_runtime -type f)
sed -i "s/example.org/$1/g" ${files}
sed -i "s/email=\"\"/email=\"$2\"/g" ${files}
sed -i "s/example.org/$1/g" ./nginx/nginx.conf
sed -i "s/example.org/$1/g" ./docker-compose.yml
