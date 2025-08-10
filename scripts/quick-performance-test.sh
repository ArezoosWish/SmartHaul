#!/bin/bash

echo "🚀 Quick SmartHaul Performance Test"
echo "==================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_BASE_URL="http://localhost:8000"

echo -e "${BLUE}📊 Testing Performance Monitoring System...${NC}"

# Test basic health
echo -e "${BLUE}🏥 Testing API Health...${NC}"
health_response=$(curl -s "${API_BASE_URL}/health")
echo "Health Status: $health_response"

# Test performance metrics
echo -e "${BLUE}📈 Getting Performance Metrics...${NC}"
metrics_response=$(curl -s "${API_BASE_URL}/api/performance/metrics")
echo "Metrics: $metrics_response"

# Test performance alerts
echo -e "${BLUE}🚨 Getting Performance Alerts...${NC}"
alerts_response=$(curl -s "${API_BASE_URL}/api/performance/alerts")
echo "Alerts: $alerts_response"

# Generate some load
echo -e "${BLUE}⚡ Generating Load (10 requests)...${NC}"
for i in {1..10}; do
    curl -s "${API_BASE_URL}/shipments" > /dev/null &
    curl -s "${API_BASE_URL}/trucks" > /dev/null &
    curl -s "${API_BASE_URL}/users" > /dev/null &
done
wait

# Get updated metrics
echo -e "${BLUE}📊 Updated Performance Metrics...${NC}"
updated_metrics=$(curl -s "${API_BASE_URL}/api/performance/metrics")
echo "Updated Metrics: $updated_metrics"

echo -e "${GREEN}✅ Performance test complete!${NC}"
echo -e "${YELLOW}💡 Check the Performance Dashboard at http://localhost:5174${NC}" 