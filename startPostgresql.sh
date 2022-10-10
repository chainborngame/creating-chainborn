#!/bin/sh
docker network create chainborn-test
NAME=chainborn-postgres
docker stop $NAME
docker run --rm --name $NAME \
--network chainborn-test --network-alias pgmaster \
-p 5432:5432 \
-e POSTGRES_PASSWORD=password \
-v $(pwd)/pgdata:/var/lib/postgresql/data \
-it postgres:14.3
