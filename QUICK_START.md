# 🎯 StartupBoost AWS Deployment - Quick Start Card

## ⚡ One-Command Deployment

### Local Testing
```bash
npm run aws:setup
# Opens http://localhost:3000
```

### EC2 Production
```bash
npm run aws:deploy:ec2
# Prompts for: Key Pair, Instance Type, API Key
# Takes ~10 minutes
```

### Lambda Production
```bash
npm run aws:deploy:lambda
# Prompts for: Stage, API Key
# Takes ~3 minutes
```

## 🔑 Required Environment Variables

```bash
GEMINI_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=production
```

## 📊 Cost Comparison

| Option | Cost/Month | Best For |
|--------|------------|----------|
| EC2 (t3.small) | ~$15 | Testing |
| EC2 (t3.medium) | ~$30 | Production |
| Lambda | ~$0-20 | Variable traffic |

## 🧪 Testing

```bash
# Test deployment
npm run aws:test

# Monitor health (5 min)
./aws/monitor-deployment.sh

# View logs (EC2)
docker-compose logs -f

# View logs (Lambda)
serverless logs -f api -t
```

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Script not executable | `chmod +x aws/*.sh` |
| Docker permission | `sudo usermod -aG docker $USER` |
| AWS not configured | `aws configure` |
| Missing API key | Get from makersuite.google.com |

## 📞 Support Files

- `AWS_SETUP_SUMMARY.md` - Overview
- `aws/AWS_DEPLOYMENT_GUIDE.md` - Full guide
- `aws/QUICK_REFERENCE.md` - Commands
- `aws/TESTING_CHECKLIST.md` - Testing

## 🎓 Complete Workflow

```bash
# 1. Local setup
npm run aws:setup

# 2. Test locally
curl http://localhost:3000/health

# 3. Deploy to AWS
npm run aws:deploy:ec2  # or deploy:lambda

# 4. Test deployment
npm run aws:test

# 5. Monitor
./aws/monitor-deployment.sh
```

## 🚀 You're Ready!

**Start here:** Open `AWS_SETUP_SUMMARY.md`

---
*Last Updated: December 8, 2024*
