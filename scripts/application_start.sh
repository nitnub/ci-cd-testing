#!/bin/bash

echo 'run application_start.sh: ' >> /home/ec2-user/ci-cd-instance-v2/deploy.log

echo 'pm2 restart ci-cd-testing' >> /home/ec2-user/ci-cd-instance-v2/deploy.log
pm2 restart nodejs-express-app >> /home/ec2-user/ci-cd-instance-v2/deploy.log
