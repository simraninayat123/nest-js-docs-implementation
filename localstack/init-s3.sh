#!/bin/bash
npm install -g @localstack/lstk
lstk --endpoint-url http://localhost:4566 setup aws
lstk --endpoint-url http://localhost:4566 aws s3 mb s3://${AWS_DEFAULT_S3_BUCKET}
