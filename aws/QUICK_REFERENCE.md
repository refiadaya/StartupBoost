# AWS Deployment Quick Reference

## 🚀 Quick Start Commands

### EC2 Deployment
```bash
# 1. Make scripts executable
chmod +x aws/deploy-ec2.sh aws/test-deployment.sh

# 2. Create EC2 key pair (if needed)
aws ec2 create-key-pair --key-name startupboost-key \
  --query 'KeyMaterial' --output text > startupboost-key.pem
chmod 400 startupboost-key.pem

# 3. Deploy
./aws/deploy-ec2.sh

# 4. Test
./aws/test-deployment.sh
```

### Lambda Deployment
```bash
# 1. Install dependencies
npm install -g serverless
npm install serverless-http --save

# 2. Deploy
chmod +x aws/deploy-lambda.sh
./aws/deploy-lambda.sh

# 3. Test
serverless invoke -f api --stage dev
```

## 📋 Pre-Deployment Checklist

- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Docker installed (for EC2)
- [ ] Node.js 18+ installed
- [ ] Gemini API key ready
- [ ] EC2 key pair created (for EC2)
- [ ] Repository pushed to GitHub

## 🔑 Required Environment Variables

```bash
GEMINI_API_KEY=your_key_here
PORT=3000
NODE_ENV=production
PYTHON_SERVICE_URL=http://python-service:5000
```

## 🧪 Testing Endpoints

### Health Check
```bash
curl http://your-endpoint:3000/health
```

### Analysis Test
```bash
curl -X POST http://your-endpoint:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}'
```

## 📊 Monitoring

### EC2
```bash
# SSH into instance
ssh -i startupboost-key.pem ec2-user@<ip>

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

### Lambda
```bash
# View logs
serverless logs -f api -t

# Get info
serverless info --stage prod
```

## 🔥 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Container won't start | Check `docker-compose logs` for errors |
| Lambda timeout | Increase timeout in `serverless.yml` |
| 502 Gateway Error | Check Lambda logs, verify response format |
| Python service error | Verify `PYTHON_SERVICE_URL` is correct |
| Out of memory | Increase instance size or Lambda memory |

## 💰 Cost Optimization

### EC2
- Use t3.small for testing ($15/month)
- t3.medium for production ($30/month)
- Stop instance when not in use

### Lambda
- Free tier: 1M requests/month
- Use provisioned concurrency for consistent performance
- Enable caching at API Gateway level

## 🛠️ Useful Commands

```bash
# EC2: Update application
ssh -i key.pem ec2-user@<ip>
cd StartupBoost
git pull
docker-compose up -d --build

# Lambda: Redeploy
serverless deploy --stage prod

# Check AWS resources
aws cloudformation describe-stacks --stack-name StartupBoost-Stack
aws lambda list-functions | grep startupboost

# Delete deployment
aws cloudformation delete-stack --stack-name StartupBoost-Stack
serverless remove --stage prod
```

## 📞 Support

Issues? Check:
1. CloudWatch Logs
2. Security group settings
3. Environment variables
4. GitHub Issues
