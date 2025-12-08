# StartupBoost AWS Deployment - Testing Checklist

## Pre-Deployment Testing

### ✅ Local Environment
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file configured with `GEMINI_API_KEY`
- [ ] Docker and Docker Compose installed
- [ ] Local build successful (`docker-compose build`)
- [ ] Services start successfully (`docker-compose up`)
- [ ] Health endpoints respond:
  - [ ] http://localhost:3000/health
  - [ ] http://localhost:5000/health
- [ ] Analysis endpoint works locally
- [ ] No errors in logs (`docker-compose logs`)

### ✅ AWS Prerequisites
- [ ] AWS CLI installed and configured
- [ ] AWS credentials have necessary permissions:
  - [ ] EC2 (for EC2 deployment)
  - [ ] Lambda (for serverless deployment)
  - [ ] CloudFormation
  - [ ] IAM
  - [ ] VPC
- [ ] EC2 key pair created (for EC2 deployment)
- [ ] Gemini API key ready
- [ ] GitHub repository up to date

## EC2 Deployment Testing

### ✅ Deployment Process
- [ ] CloudFormation template validated
- [ ] Stack creation initiated
- [ ] Stack creation completed (check AWS Console)
- [ ] EC2 instance running
- [ ] Security groups configured correctly
- [ ] Instance has public IP assigned

### ✅ Instance Health
- [ ] Can SSH into instance: `ssh -i key.pem ec2-user@<ip>`
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] Application repository cloned
- [ ] `.env` file created with API key
- [ ] Docker containers built successfully
- [ ] Containers are running: `docker ps`

### ✅ Application Testing
- [ ] Health endpoint accessible: `http://<public-ip>:3000/health`
- [ ] Returns status 200 and valid JSON
- [ ] Node.js container logs show no errors
- [ ] Python container logs show no errors
- [ ] Can POST to `/api/analyze` endpoint
- [ ] Analysis completes successfully (15-30 seconds)
- [ ] Response includes all expected fields:
  - [ ] `mainCriteria` scores
  - [ ] `behavioralDrivers` analysis
  - [ ] `signals` detected
  - [ ] AI-generated insights

### ✅ Performance Testing
- [ ] Response time < 30 seconds for analysis
- [ ] No memory leaks (monitor over time)
- [ ] CPU usage acceptable
- [ ] Multiple concurrent requests work
- [ ] No timeout errors

## Lambda Deployment Testing

### ✅ Deployment Process
- [ ] Serverless Framework installed
- [ ] Dependencies installed (including `serverless-http`)
- [ ] Lambda layer created
- [ ] Deployment successful
- [ ] API Gateway endpoint created
- [ ] Lambda function deployed

### ✅ Lambda Function Testing
- [ ] Health endpoint: `https://<api-id>.execute-api.region.amazonaws.com/health`
- [ ] Analyze endpoint responds
- [ ] Cold start time acceptable (< 5 seconds)
- [ ] Warm invocations fast (< 2 seconds)
- [ ] No timeout errors (within 30s limit)
- [ ] Environment variables set correctly
- [ ] CloudWatch logs created

### ✅ API Gateway Testing
- [ ] CORS headers present
- [ ] POST requests work
- [ ] Error responses formatted correctly
- [ ] Rate limiting configured (optional)
- [ ] API key authentication (optional)

## Security Testing

### ✅ Network Security
- [ ] Only required ports open (22, 80, 443, 3000)
- [ ] SSH restricted to specific IP (not 0.0.0.0/0)
- [ ] HTTPS configured (optional for testing)
- [ ] No sensitive data in logs
- [ ] API key not exposed in responses

### ✅ Application Security
- [ ] Environment variables not committed to git
- [ ] No API keys in CloudWatch logs
- [ ] Input validation working
- [ ] Error messages don't leak sensitive info
- [ ] CORS configured appropriately

## Load Testing

### ✅ Basic Load Test
```bash
# Install Apache Bench
sudo apt-get install apache2-utils  # Ubuntu
brew install ab                     # macOS

# Run load test (100 requests, 10 concurrent)
ab -n 100 -c 10 -p test-payload.json -T application/json \
  http://your-endpoint:3000/api/analyze
```

- [ ] All requests completed successfully
- [ ] Average response time acceptable
- [ ] No failed requests
- [ ] Memory usage stable
- [ ] CPU usage acceptable

## Monitoring Setup

### ✅ CloudWatch
- [ ] Log groups created
- [ ] Logs being written
- [ ] Alarms configured (optional):
  - [ ] High error rate
  - [ ] High CPU usage
  - [ ] High memory usage
  - [ ] Long response times

### ✅ Application Monitoring
- [ ] Health check cron job working (EC2)
- [ ] Auto-restart on failure configured
- [ ] Disk space monitoring (EC2)

## Cost Monitoring

### ✅ AWS Costs
- [ ] Billing alerts configured
- [ ] Understand expected monthly costs:
  - EC2: ~$30-100/month
  - Lambda: ~$0-20/month (low traffic)
- [ ] Resources tagged for cost tracking
- [ ] Unused resources identified

## Documentation

### ✅ Deployment Documentation
- [ ] Deployment steps documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide created
- [ ] Rollback procedure documented
- [ ] Architecture diagram created (optional)

## Post-Deployment

### ✅ Maintenance
- [ ] Backup strategy defined
- [ ] Update procedure documented
- [ ] Monitoring dashboard setup (optional)
- [ ] Auto-scaling configured (if needed)
- [ ] Disaster recovery plan (optional)

## Sample Test Commands

```bash
# Health check
curl http://your-endpoint:3000/health

# Simple analysis
curl -X POST http://your-endpoint:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}'

# Check logs (EC2)
docker-compose logs -f

# Check logs (Lambda)
aws logs tail /aws/lambda/startupboost-prod-api --follow

# Monitor resources (EC2)
htop  # or top
docker stats

# Test multiple URLs
for url in "https://stripe.com" "https://vercel.com" "https://github.com"; do
  echo "Testing $url"
  curl -X POST http://your-endpoint:3000/api/analyze \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"$url\"}"
  echo ""
done
```

## Success Criteria

Deployment is successful when:
- ✅ All health checks pass
- ✅ Analysis endpoint returns results
- ✅ Response time < 30 seconds
- ✅ No errors in logs
- ✅ Can handle multiple concurrent requests
- ✅ Monitoring and alerts configured
- ✅ Documentation complete

## Troubleshooting

If any test fails:
1. Check CloudWatch/Docker logs
2. Verify environment variables
3. Check security groups/CORS
4. Test each service independently
5. Review deployment scripts
6. Consult AWS_DEPLOYMENT_GUIDE.md

---

**Date Tested:** _______________
**Tested By:** _______________
**Deployment Type:** [ ] EC2  [ ] Lambda
**Status:** [ ] Pass  [ ] Fail  [ ] Partial
