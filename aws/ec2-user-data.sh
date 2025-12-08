#!/bin/bash
# AWS EC2 User Data Script for StartupBoost
# This script will run on instance launch to set up the application

set -e

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo yum install -y git

# Clone repository (replace with your repo)
cd /home/ec2-user
git clone https://github.com/refiadaya/StartupBoost.git
cd StartupBoost

# Create .env file (you should set these via EC2 instance metadata or AWS Systems Manager Parameter Store)
cat > .env << EOF
GEMINI_API_KEY=${GEMINI_API_KEY}
PORT=3000
NODE_ENV=production
PYTHON_SERVICE_URL=http://python-service:5000
EOF

# Build and start services
sudo docker-compose up -d

# Set up log rotation
sudo cat > /etc/logrotate.d/startupboost << EOF
/home/ec2-user/StartupBoost/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 ec2-user ec2-user
}
EOF

# Enable Docker to start on boot
sudo chkconfig docker on

# Create a simple health check cron job
echo "*/5 * * * * curl -f http://localhost:3000/health || sudo docker-compose restart" | sudo crontab -

echo "StartupBoost installation complete!"
