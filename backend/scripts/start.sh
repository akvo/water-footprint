#!/bin/sh
set -e

npm run seed-sdg
npm run seed-country
npm run seed-project-types
npm run start
