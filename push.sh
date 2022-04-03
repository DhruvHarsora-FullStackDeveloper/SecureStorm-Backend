#! /bin/bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 381191386722.dkr.ecr.us-east-1.amazonaws.com
var=$(docker images -q)
docker rmi $var
docker build -t securespot .
docker tag securespot:latest 381191386722.dkr.ecr.us-east-1.amazonaws.com/securespot:latest
docker push 381191386722.dkr.ecr.us-east-1.amazonaws.com/securespot:latest
