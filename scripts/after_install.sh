echo 'run after_install.sh: ' >> /home/ec2-user/ci-cd-testing/deploy.log

echo 'cd /home/ec2-user/ci-cd-testing' >> /home/ec2-user/ci-cd-testing/deploy.log
cd /home/ec2-user/ci-cd-testing >> /home/ec2-user/ci-cd-testing/deploy.log

echo 'npm install' >> /home/ec2-user/ci-cd-testing/deploy.log 
npm install >> /home/ec2-user/ci-cd-testing/deploy.log


