#!/bin/sh
NAME=chainborn-hasura
docker stop $NAME
docker run --rm --name $NAME \
--network chainborn-test \
-p 8081:8080 \
-e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:password@pgmaster:5432/chainborn \
-e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
-it hasura/graphql-engine:latest
