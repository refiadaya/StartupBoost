#!/bin/bash
# Rollback script for EC2 deployment

set -e

echo "🔄 StartupBoost EC2 Rollback Script"
echo "===================================="

# Get last successful deployment tag
read -p "Enter the commit hash or tag to rollback to: " COMMIT_HASH

if [ -z "$COMMIT_HASH" ]; then
    echo "❌ Commit hash is required"
    exit 1
fi

read -p "Enter EC2 instance IP: " EC2_IP
read -p "Enter SSH key path [./startupboost-key.pem]: " SSH_KEY
SSH_KEY=${SSH_KEY:-./startupboost-key.pem}

echo ""
echo "Rolling back to commit: $COMMIT_HASH"
echo "EC2 Instance: $EC2_IP"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# SSH into instance and rollback
ssh -i "$SSH_KEY" ec2-user@"$EC2_IP" << EOF
    set -e
    
    echo "Stopping current services..."
    cd ~/StartupBoost
    docker-compose down
    
    echo "Checking out previous version..."
    git fetch --all
    git checkout $COMMIT_HASH
    
    echo "Rebuilding containers..."
    docker-compose build
    
    echo "Starting services..."
    docker-compose up -d
    
    echo "Checking service health..."
    sleep 10
    docker-compose ps
    
    echo "✅ Rollback complete!"
EOF

echo ""
echo "Testing deployment..."
sleep 5

if curl -f "http://$EC2_IP:3000/health" &> /dev/null; then
    echo "✅ Health check passed after rollback"
else
    echo "❌ Health check failed - manual intervention needed"
    exit 1
fi

echo ""
echo "🎉 Rollback completed successfully!"
