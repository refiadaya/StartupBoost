# AWS Deployment Files

This directory contains all files needed for deploying StartupBoost to AWS infrastructure.

## 📁 Directory Structure

```
aws/
├── AWS_DEPLOYMENT_GUIDE.md    # Comprehensive deployment guide
├── QUICK_REFERENCE.md         # Quick command reference
├── TESTING_CHECKLIST.md       # Testing checklist
├── .env.example               # Environment variables template
├── cloudformation-ec2.yml     # CloudFormation template for EC2
├── serverless.yml             # Serverless Framework configuration
├── lambda-handler.js          # Lambda function handler
├── ec2-user-data.sh          # EC2 initialization script
├── deploy-ec2.sh             # EC2 deployment script
├── deploy-lambda.sh          # Lambda deployment script
├── test-deployment.sh        # Deployment testing script
├── local-setup.sh            # Local environment setup
└── python-lambda/            # Python Lambda function
    ├── handler.py
    └── requirements.txt
```

## 🚀 Quick Start

### For EC2 Deployment:
```bash
./aws/deploy-ec2.sh
```

### For Lambda Deployment:
```bash
./aws/deploy-lambda.sh
```

### Local Testing:
```bash
./aws/local-setup.sh
```

## 📚 Documentation

- **[AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)** - Complete deployment guide with detailed instructions
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick command reference
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Comprehensive testing checklist

## 🔑 Required Secrets

For GitHub Actions (CI/CD):
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `GEMINI_API_KEY` - Google Gemini API key
- `EC2_HOST` - EC2 instance public IP
- `EC2_SSH_KEY` - EC2 SSH private key

## 💡 Deployment Options

### Option 1: EC2 (Recommended)
- Full control
- Consistent performance
- Better for development/testing
- Cost: ~$30-100/month

### Option 2: Lambda (Serverless)
- Auto-scaling
- Pay-per-use
- No server maintenance
- Cost: ~$0-20/month (low traffic)

## 🛠️ Prerequisites

- AWS CLI installed and configured
- Docker & Docker Compose (for EC2)
- Node.js 18+
- Serverless Framework (for Lambda)
- Google Gemini API key

## 📞 Support

See troubleshooting section in [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)
