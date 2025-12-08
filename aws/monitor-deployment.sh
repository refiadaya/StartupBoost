#!/bin/bash
# Monitor AWS deployment health and performance

set -e

echo "📊 StartupBoost Deployment Monitor"
echo "==================================="

# Get endpoint
read -p "Enter deployment endpoint (e.g., http://ec2-xx.compute.amazonaws.com:3000 or Lambda URL): " ENDPOINT
ENDPOINT=${ENDPOINT%/}

# Monitor interval
INTERVAL=30
DURATION=${1:-300}  # Default 5 minutes

echo ""
echo "Monitoring: $ENDPOINT"
echo "Interval: ${INTERVAL}s"
echo "Duration: ${DURATION}s"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Counters
SUCCESS=0
FAILED=0
TOTAL=0
START_TIME=$(date +%s)

# Monitoring loop
while true; do
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))
    
    if [ $ELAPSED -ge $DURATION ]; then
        break
    fi
    
    # Health check
    RESPONSE=$(curl -s -w "\n%{http_code}\n%{time_total}" "$ENDPOINT/health" 2>/dev/null || echo "000\n999")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n2 | head -n1)
    RESPONSE_TIME=$(echo "$RESPONSE" | tail -n1)
    
    TOTAL=$((TOTAL + 1))
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [ "$HTTP_CODE" = "200" ]; then
        SUCCESS=$((SUCCESS + 1))
        printf "✅ [%s] HTTP %s | Response: %.3fs | Success: %d/%d (%.1f%%)\n" \
            "$TIMESTAMP" "$HTTP_CODE" "$RESPONSE_TIME" "$SUCCESS" "$TOTAL" \
            "$(awk "BEGIN {printf \"%.1f\", ($SUCCESS/$TOTAL)*100}")"
    else
        FAILED=$((FAILED + 1))
        printf "❌ [%s] HTTP %s | Response: %.3fs | Failed: %d/%d (%.1f%%)\n" \
            "$TIMESTAMP" "$HTTP_CODE" "$RESPONSE_TIME" "$FAILED" "$TOTAL" \
            "$(awk "BEGIN {printf \"%.1f\", ($FAILED/$TOTAL)*100}")"
    fi
    
    sleep $INTERVAL
done

# Summary
echo ""
echo "📊 Monitoring Summary"
echo "===================="
echo "Total Requests: $TOTAL"
echo "Successful: $SUCCESS ($(awk "BEGIN {printf \"%.1f\", ($SUCCESS/$TOTAL)*100}")%)"
echo "Failed: $FAILED ($(awk "BEGIN {printf \"%.1f\", ($FAILED/$TOTAL)*100}")%)"
echo "Duration: ${DURATION}s"

# Calculate uptime
UPTIME=$(awk "BEGIN {printf \"%.2f\", ($SUCCESS/$TOTAL)*100}")
echo "Uptime: ${UPTIME}%"

# Status
if (( $(echo "$UPTIME >= 99" | bc -l) )); then
    echo "Status: 🟢 Excellent"
elif (( $(echo "$UPTIME >= 95" | bc -l) )); then
    echo "Status: 🟡 Good"
else
    echo "Status: 🔴 Needs Attention"
fi
