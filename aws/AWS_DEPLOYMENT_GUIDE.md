# AWS Deployment Guide for StartupBoost

This guide covers deploying StartupBoost to AWS using both EC2 and Lambda options.

## 📋 Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured (`aws configure`)
- Node.js 18+ installed
- Docker installed (for EC2 deployment)
- Google Gemini API Key

## 🎯 Deployment Options

### Option 1: EC2 Deployment (Recommended for Full Control)

**Pros:**
- Full control over the environment
- Consistent performance
- Easier to debug
- Can run both Node.js and Python services together
- Better for long-running processes

**Cons:**
- Higher cost (instance always running)
- Requires manual scaling
- More maintenance

#### Steps:

1. **Prepare your environment:**
   ```bash
   # Make deployment scripts executable
   chmod +x aws/deploy-ec2.sh
   chmod +x aws/test-deployment.sh
   ```

2. **Create EC2 Key Pair (if you don't have one):**
   ```bash
   aws ec2 create-key-pair \
     --key-name startupboost-key \
     --query 'KeyMaterial' \
     --output text > startupboost-key.pem
   
   chmod 400 startupboost-key.pem
   ```

3. **Deploy using CloudFormation:**
   ```bash
   ./aws/deploy-ec2.sh
   ```
   
   The script will prompt you for:
   - EC2 Key Pair Name
   - Instance Type (default: t3.medium)
   - Gemini API Key
   - SSH CIDR (your IP for security)

4. **Wait for deployment (5-10 minutes)**
   
   The script will:
   - Create VPC, subnets, and security groups
   - Launch EC2 instance
   - Install Docker and Docker Compose
   - Clone your repository
   - Build and start containers

5. **Test your deployment:**
   ```bash
   ./aws/test-deployment.sh
   ```

6. **Access your application:**
   ```
   http://<EC2-Public-IP>:3000
   ```

#### Manual EC2 Deployment

If you prefer manual deployment:

```bash
# SSH into your EC2 instance
ssh -i startupboost-key.pem ec2-user@<EC2-Public-IP>

# Clone repository
git clone https://github.com/refiadaya/StartupBoost.git
cd StartupBoost

# Create .env file
cat > .env << EOF
GEMINI_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=production
PYTHON_SERVICE_URL=http://python-service:5000
EOF

# Build and start with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Option 2: Lambda Deployment (Serverless)

**Pros:**
- Pay only for what you use
- Auto-scaling built-in
- No server maintenance
- Cost-effective for low/variable traffic

**Cons:**
- Cold start latency
- 30-second timeout (can be limiting for long analyses)
- More complex debugging
- Need separate deployment for Python service

#### Steps:

1. **Install Serverless Framework:**
   ```bash
   npm install -g serverless
   npm install --save-dev serverless-offline serverless-plugin-optimize
   ```

2. **Add serverless-http dependency:**
   ```bash
   npm install serverless-http
   ```

3. **Configure environment variables:**
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   export PYTHON_SERVICE_URL_DEV=http://localhost:5000
   # For production, you might deploy Python service to EC2 or another Lambda
   export PYTHON_SERVICE_URL_PROD=https://your-python-service-url
   ```

4. **Deploy to Lambda:**
   ```bash
   chmod +x aws/deploy-lambda.sh
   ./aws/deploy-lambda.sh
   ```

5. **Test locally first (optional):**
   ```bash
   serverless offline start
   # Access at http://localhost:3000
   ```

6. **Deploy to AWS:**
   ```bash
   serverless deploy --stage prod
   ```

7. **Get your API endpoint:**
   ```bash
   serverless info --stage prod
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional
PORT=3000
NODE_ENV=production
PYTHON_SERVICE_URL=http://python-service:5000
```

### Security Considerations

1. **Never commit your .env file or API keys**
2. **Use AWS Systems Manager Parameter Store** for sensitive data:
   ```bash
   aws ssm put-parameter \
     --name "/startupboost/gemini-api-key" \
     --value "your-api-key" \
     --type "SecureString"
   ```

3. **Restrict security group rules** to your IP only
4. **Enable CloudWatch logging** for monitoring
5. **Set up AWS WAF** for API protection (production)

## 📊 Monitoring & Logging

### CloudWatch Logs

View logs for your deployment:

```bash
# For EC2 (via SSH)
docker-compose logs -f

# For Lambda
aws logs tail /aws/lambda/startupboost-prod-api --follow
```

### CloudWatch Metrics

Monitor your application:
- CPU/Memory usage (EC2)
- Lambda invocations and duration
- API Gateway requests
- Error rates

### Set up Alarms

```bash
# Example: Alert on high error rate
aws cloudwatch put-metric-alarm \
  --alarm-name startupboost-high-errors \
  --alarm-description "Alert when error rate is high" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

## 🚀 Scaling

### EC2 Auto Scaling

For high traffic, set up Auto Scaling Group:

1. Create AMI from your configured EC2 instance
2. Create Launch Template
3. Set up Auto Scaling Group with target tracking
4. Add Application Load Balancer

### Lambda Auto Scaling

Lambda scales automatically, but you can:
- Set reserved concurrency
- Provision concurrent executions
- Use API Gateway caching

## 🧹 Cleanup

### Delete EC2 Stack

```bash
aws cloudformation delete-stack --stack-name StartupBoost-Stack
```

### Delete Lambda Deployment

```bash
serverless remove --stage prod
```

## 💰 Cost Estimation

### EC2 (t3.medium, us-east-1)
- Instance: ~$30/month
- Data transfer: ~$9/GB out
- EBS storage: ~$10/month (100GB)
- **Total: ~$50-100/month** (depending on traffic)

### Lambda
- First 1M requests/month: Free
- After: $0.20 per 1M requests
- Duration: $0.0000166667 per GB-second
- **Total: ~$0-20/month** (low traffic)

## 🔍 Troubleshooting

### Common Issues

1. **Container fails to start:**
   ```bash
   docker-compose logs
   # Check for missing environment variables or port conflicts
   ```

2. **Lambda timeout:**
   - Increase timeout in `serverless.yml`
   - Optimize AI calls
   - Consider using Step Functions for long processes

3. **Python service connection error:**
   - Verify `PYTHON_SERVICE_URL` is correct
   - Check security groups allow port 5000
   - Ensure Docker network is configured

4. **API Gateway 502 errors:**
   - Check Lambda logs
   - Verify response format
   - Check Lambda timeout settings

### Debug Mode

Enable verbose logging:

```bash
# EC2
docker-compose logs -f nodejs-app

# Lambda
serverless logs -f api -t
```

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🆘 Support

If you encounter issues:
1. Check CloudWatch Logs
2. Review security group settings
3. Verify environment variables
4. Test endpoints with the test script
5. Open an issue on GitHub

---

**Happy Deploying! 🚀**
