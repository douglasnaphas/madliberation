#!/bin/bash

# get the bucket name from SSM param store

source scripts/deploy-to-bucket.sh
# this can be un-commented once I can verify that the bucket's param is in
# SSM
# deploy-to-bucket ${BUCKET}
