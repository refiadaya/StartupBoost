#!/bin/bash
# Deploy StartupBoost to AWS EC2 using CloudFormation

set -e

echo "🚀 StartupBoost EC2 Deployment Script"
echo "======================================"

# Configuration
STACK_NAME="StartupBoost-Stack"
TEMPLATE_FILE="aws/cloudformation-ec2.yml"
REGION="${AWS_REGION:-us-east-1}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Prompt for parameters
read -p "Enter EC2 Key Pair Name (must exist in AWS): " KEY_NAME
read -p "Enter Instance Type [t3.medium]: " INSTANCE_TYPE
INSTANCE_TYPE=${INSTANCE_TYPE:-t3.medium}

read -sp "Enter Gemini API Key: " GEMINI_API_KEY
echo ""

read -p "Enter SSH CIDR (e.g., your IP/32) [0.0.0.0/0]: " SSH_LOCATION
SSH_LOCATION=${SSH_LOCATION:-0.0.0.0/0}

# Validate stack
echo ""
echo "📋 Validating CloudFormation template..."
aws cloudformation validate-template \
    --template-body file://${TEMPLATE_FILE} \
    --region ${REGION}

echo "✅ Template is valid"

# Deploy stack
echo ""
echo "🏗️  Deploying CloudFormation stack..."
aws cloudformation create-stack \
    --stack-name ${STACK_NAME} \
    --template-body file://${TEMPLATE_FILE} \
    --parameters \
        ParameterKey=KeyName,ParameterValue=${KEY_NAME} \
        ParameterKey=InstanceType,ParameterValue=${INSTANCE_TYPE} \
        ParameterKey=GeminiAPIKey,ParameterValue=${GEMINI_API_KEY} \
        ParameterKey=SSHLocation,ParameterValue=${SSH_LOCATION} \
    --region ${REGION} \
    --capabilities CAPABILITY_IAM

echo ""
echo "⏳ Waiting for stack creation to complete..."
aws cloudformation wait stack-create-complete \
    --stack-name ${STACK_NAME} \
    --region ${REGION}

# Get outputs
echo ""
echo "✅ Stack created successfully!"
echo ""
echo "📊 Stack Outputs:"
aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${REGION} \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
    --output table

# Save outputs to file
aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${REGION} \
    --query 'Stacks[0].Outputs' \
    --output json > deployment-info.json

echo ""
echo "💾 Deployment info saved to deployment-info.json"
echo ""
echo "🎉 Deployment complete! Your application will be available in a few minutes."
echo "   Allow time for Docker containers to build and start."
