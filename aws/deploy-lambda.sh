#!/bin/bash
# Deploy StartupBoost to AWS Lambda using Serverless Framework

set -e

echo "🚀 StartupBoost Lambda Deployment Script"
echo "========================================="

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework is not installed."
    echo "Installing now..."
    npm install -g serverless
fi

echo "✅ Serverless Framework installed"

# Check if serverless plugins are installed
if [ ! -d "node_modules/serverless-offline" ]; then
    echo "📦 Installing Serverless plugins..."
    npm install --save-dev serverless-offline serverless-plugin-optimize
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials configured"

# Get deployment stage
read -p "Enter deployment stage [dev]: " STAGE
STAGE=${STAGE:-dev}

# Check for Gemini API key
if [ -z "$GEMINI_API_KEY" ]; then
    read -sp "Enter Gemini API Key: " GEMINI_API_KEY
    echo ""
    export GEMINI_API_KEY
fi

# Create Lambda layer for dependencies
echo ""
echo "📦 Preparing Lambda layer..."
mkdir -p layer/nodejs
cp package.json package-lock.json layer/nodejs/
cd layer/nodejs
npm ci --production
cd ../..

# Deploy to AWS
echo ""
echo "🚀 Deploying to AWS Lambda..."
serverless deploy --stage ${STAGE} --verbose

# Get deployment info
echo ""
echo "📊 Deployment Information:"
serverless info --stage ${STAGE}

# Save endpoint to file
serverless info --stage ${STAGE} > lambda-deployment-info.txt

echo ""
echo "💾 Deployment info saved to lambda-deployment-info.txt"
echo ""
echo "🎉 Lambda deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Test your API endpoint using the URL above"
echo "   2. Set up custom domain (optional)"
echo "   3. Configure CloudWatch alarms for monitoring"
