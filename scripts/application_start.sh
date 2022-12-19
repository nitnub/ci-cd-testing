echo 'run application_start.sh: ' >> /home/ec2-user/ci-cd-instance-v2/deploy.log

echo 'docker compose up -d' >> /home/ec2-user/ci-cd-instance-v2/deploy.log
docker compose up -d >> /home/ec2-user/ci-cd-instance-v2/deploy.log