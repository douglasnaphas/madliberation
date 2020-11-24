#!/bin/bash

if ! type aws &> /dev/null
then
  echo "aws is not installed"
  echo "please install the aws cli tool to proceed"
  echo "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html"
  exit 1
fi

if ! aws sts get-caller-identity > /dev/null
then
  echo "Unable to invoke the aws cli successfully"
  echo "Is AWS_PROFILE set, or are AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, " \
    "and AWS_DEFAULT_REGION all set?"
  exit 1
fi
