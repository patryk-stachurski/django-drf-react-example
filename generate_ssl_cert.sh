#!/usr/bin/env bash

USAGE="Usage: $0 your-domain-name.com your-email@gmail.com"

if [[ ! $1 ]]
then
    echo ${USAGE}
    exit 1
fi

if [[ ! $2 ]]
then
    echo ${USAGE}
    exit 1
fi

echo "Creating certificate for domain: $1"
echo

cp -R init_certbot init_certbot_runtime

bash ./replace_domain.sh $1

cd init_certbot_runtime
bash ./init-letsencrypt.sh
cd ..

echo "Removing docker containers..."
containers_ids=`docker ps -f "name=init_certbot_runtime" -q`

for id in ${containers_ids}
do
    docker container rm --force ${id}
done

echo "Removing docker images..."
images_ids=`docker images "init_certbot_runtime*" -q`

for id in ${images_ids}
do
    docker image rm --force ${id}
done

echo
echo "Done!"
echo
echo "Now please change ownership of certbot files and copy them"
echo
echo "  sudo chown -R \$USER:\$USER ./init_certbot_runtime"
echo "  cp -R ./init_certbot_runtime/data/certbot ./nginx"
echo
echo "Then you can start containers"
echo
echo "  docker-compose up --build --detach"
