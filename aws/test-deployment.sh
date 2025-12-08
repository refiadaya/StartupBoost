#!/bin/bash
# Test AWS deployment endpoints

set -e

echo "🧪 StartupBoost Deployment Test Script"
echo "======================================"

# Prompt for endpoint URL
read -p "Enter your deployment URL (e.g., http://ec2-xx-xx-xx-xx.compute.amazonaws.com:3000): " BASE_URL

# Remove trailing slash
BASE_URL=${BASE_URL%/}

echo ""
echo "Testing deployment at: $BASE_URL"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health")
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HEALTH_CODE" = "200" ]; then
    echo "   ✅ Health check passed"
    echo "   Response: $HEALTH_BODY"
else
    echo "   ❌ Health check failed (HTTP $HEALTH_CODE)"
    exit 1
fi

echo ""

# Test 2: Simple Analysis
echo "2️⃣  Testing analysis endpoint..."
TEST_PAYLOAD='{
  "url": "https://stripe.com"
}'

echo "   Analyzing: https://stripe.com"
echo "   This may take 15-30 seconds..."

ANALYZE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$TEST_PAYLOAD" \
    "${BASE_URL}/api/analyze")

ANALYZE_CODE=$(echo "$ANALYZE_RESPONSE" | tail -n1)
ANALYZE_BODY=$(echo "$ANALYZE_RESPONSE" | head -n-1)

if [ "$ANALYZE_CODE" = "200" ]; then
    echo "   ✅ Analysis completed successfully"
    echo "   Response preview:"
    echo "$ANALYZE_BODY" | head -c 500
    echo "..."
else
    echo "   ❌ Analysis failed (HTTP $ANALYZE_CODE)"
    echo "   Response: $ANALYZE_BODY"
    exit 1
fi

echo ""
echo ""
echo "🎉 All tests passed! Your deployment is working correctly."
echo ""

# Save full response for inspection
echo "$ANALYZE_BODY" > test-analysis-response.json
echo "💾 Full analysis response saved to test-analysis-response.json"
