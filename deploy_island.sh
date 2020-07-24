#!/usr/bin/env bash

aws s3 cp climate-by-location.js s3://climate-by-location.nemac.org/islands/
aws s3 cp demo.js s3://climate-by-location.nemac.org/islands/


aws s3 cp index.html s3://climate-by-location.nemac.org/islands/
aws s3 cp nemac_logo.png s3://climate-by-location.nemac.org/islands/

 aws s3 cp vendor s3://climate-by-location.nemac.org/islands/vendor --recursive

cd island_data
for f in *.json; do aws s3 cp "$f.gz" "s3://climate-by-location.nemac.org/islands/island_data/$f" --content-encoding gzip ; done;