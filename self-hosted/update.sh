#!/bin/bash
set -euv

#Git Pull
git pull

#Rebuild App
docker compose build

#Restart Service
docker compose stop && docker compose up -d
