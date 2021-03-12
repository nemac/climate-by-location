#!/usr/bin/env bash

set -e

read -p "Did you rebuild? [y/n]" -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  exit 1
fi

if [[ $# -eq 0 ]]; then
  echo "You must specify the full version you are deploying. Ex: 1.1.0"
  exit 1
fi

aws s3 sync dist/ s3://climate-by-location.nemac.org/archive/$1/
aws s3 sync dist/ s3://climate-by-location.nemac.org/

aws cloudfront create-invalidation --distribution-id E1SW810JZ202FB --paths '/*'
echo "Deploy complete"