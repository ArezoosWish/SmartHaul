#!/bin/bash

echo "🚀 SmartHaul Performance Testing Suite"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_BASE_URL="http://localhost:8000"
TEST_DURATION=60  # seconds
CONCURRENT_USERS=100
REQUESTS_PER_USER=50

# Check if required tools are installed
check_dependencies() {
    echo -e "${BLUE}🔍 Checking dependencies...${NC}"
    
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}❌ curl is required but not installed${NC}"
        exit 1
    fi
    
    if ! command -v ab &> /dev/null; then
        echo -e "${YELLOW}⚠️  Apache Bench (ab) not found. Install with: brew install httpd${NC}"
        echo -e "${YELLOW}   Using curl for basic testing...${NC}"
        USE_AB=false
    else
        USE_AB=true
    fi
    
    echo -e "${GREEN}✅ Dependencies check complete${NC}"
}

# Test API health
test_api_health() {
    echo -e "${BLUE}🏥 Testing API health...${NC}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "${API_BASE_URL}/api/performance/health")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ API is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ API health check failed (HTTP $response)${NC}"
        return 1
    fi
}

# Get baseline metrics
get_baseline_metrics() {
    echo -e "${BLUE}📊 Getting baseline metrics...${NC}"
    
    baseline=$(curl -s "${API_BASE_URL}/api/performance/metrics")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Baseline metrics captured${NC}"
        echo "$baseline" > /tmp/baseline_metrics.json
    else
        echo -e "${RED}❌ Failed to get baseline metrics${NC}"
    fi
}

# Run load test with Apache Bench
run_ab_test() {
    echo -e "${BLUE}⚡ Running Apache Bench load test...${NC}"
    echo -e "${YELLOW}   Duration: ${TEST_DURATION}s, Concurrency: ${CONCURRENT_USERS}${NC}"
    
    # Test different endpoints
    endpoints=(
        "/api/shipments"
        "/api/trucks"
        "/api/users"
        "/api/delivery-events"
        "/api/performance/metrics"
    )
    
    for endpoint in "${endpoints[@]}"; do
        echo -e "${BLUE}   Testing: ${endpoint}${NC}"
        
        ab -n $((CONCURRENT_USERS * REQUESTS_PER_USER)) \
           -c $CONCURRENT_USERS \
           -t $TEST_DURATION \
           -q \
           "${API_BASE_URL}${endpoint}" > "/tmp/ab_results_${endpoint//\//_}.txt" 2>&1
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}   ✅ Test completed for ${endpoint}${NC}"
        else
            echo -e "${RED}   ❌ Test failed for ${endpoint}${NC}"
        fi
    done
}

# Run load test with curl (fallback)
run_curl_test() {
    echo -e "${BLUE}⚡ Running curl-based load test...${NC}"
    echo -e "${YELLOW}   Simulating ${CONCURRENT_USERS} concurrent users${NC}"
    
    # Test endpoints
    endpoints=(
        "/api/shipments"
        "/api/trucks"
        "/api/users"
        "/api/delivery-events"
    )
    
    for endpoint in "${endpoints[@]}"; do
        echo -e "${BLUE}   Testing: ${endpoint}${NC}"
        
        # Simulate concurrent requests
        for i in $(seq 1 $CONCURRENT_USERS); do
            (
                for j in $(seq 1 $REQUESTS_PER_USER); do
                    curl -s -o /dev/null -w "%{http_code}\n" "${API_BASE_URL}${endpoint}" &
                done
                wait
            ) &
        done
        wait
        
        echo -e "${GREEN}   ✅ Test completed for ${endpoint}${NC}"
    done
}

# Get final metrics
get_final_metrics() {
    echo -e "${BLUE}📊 Getting final metrics...${NC}"
    
    final=$(curl -s "${API_BASE_URL}/api/performance/metrics")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Final metrics captured${NC}"
        echo "$final" > /tmp/final_metrics.json
    else
        echo -e "${RED}❌ Failed to get final metrics${NC}"
    fi
}

# Analyze results
analyze_results() {
    echo -e "${BLUE}📈 Analyzing performance results...${NC}"
    
    if [ -f /tmp/baseline_metrics.json ] && [ -f /tmp/final_metrics.json ]; then
        echo -e "${GREEN}✅ Performance analysis complete${NC}"
        
        # Extract key metrics
        baseline_calls=$(cat /tmp/baseline_metrics.json | grep -o '"total_calls":[0-9]*' | cut -d: -f2)
        final_calls=$(cat /tmp/final_metrics.json | grep -o '"total_calls":[0-9]*' | cut -d: -f2)
        total_requests=$((final_calls - baseline_calls))
        
        baseline_time=$(cat /tmp/baseline_metrics.json | grep -o '"avg_response_time_ms":[0-9.]*' | cut -d: -f2)
        final_time=$(cat /tmp/final_metrics.json | grep -o '"avg_response_time_ms":[0-9.]*' | cut -d: -f2)
        
        echo -e "${BLUE}📊 Performance Summary:${NC}"
        echo "   Total requests processed: $total_requests"
        echo "   Baseline response time: ${baseline_time}ms"
        echo "   Final response time: ${final_time}ms"
        echo "   Requests per second: $(echo "scale=1; $total_requests / $TEST_DURATION" | bc)"
        
        # Performance assessment
        if (( $(echo "$final_time < 200" | bc -l) )); then
            echo -e "${GREEN}   🎯 EXCELLENT: Response time under 200ms${NC}"
        elif (( $(echo "$final_time < 500" | bc -l) )); then
            echo -e "${YELLOW}   ⚠️  GOOD: Response time under 500ms${NC}"
        else
            echo -e "${RED}   ❌ NEEDS IMPROVEMENT: Response time over 500ms${NC}"
        fi
    else
        echo -e "${RED}❌ Could not analyze results - missing metrics files${NC}"
    fi
}

# Show AB results if available
show_ab_results() {
    if [ "$USE_AB" = true ]; then
        echo -e "${BLUE}📋 Apache Bench Results:${NC}"
        
        for file in /tmp/ab_results_*.txt; do
            if [ -f "$file" ]; then
                endpoint=$(basename "$file" | sed 's/ab_results_//' | sed 's/\.txt//' | sed 's/_/\//g')
                echo -e "${BLUE}   ${endpoint}:${NC}"
                
                # Extract key metrics
                rps=$(grep "Requests per second" "$file" | awk '{print $4}')
                mean_time=$(grep "Time per request" "$file" | head -1 | awk '{print $4}')
                failed=$(grep "Failed requests" "$file" | awk '{print $3}')
                
                echo "     Requests/sec: $rps"
                echo "     Mean time: ${mean_time}ms"
                echo "     Failed: $failed"
                echo ""
            fi
        done
    fi
}

# Cleanup
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up test files...${NC}"
    rm -f /tmp/baseline_metrics.json /tmp/final_metrics.json /tmp/ab_results_*.txt
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting SmartHaul Performance Test${NC}"
    echo "================================================"
    
    # Check dependencies
    check_dependencies
    
    # Test API health
    if ! test_api_health; then
        echo -e "${RED}❌ API is not healthy. Please start the backend server.${NC}"
        exit 1
    fi
    
    # Get baseline metrics
    get_baseline_metrics
    
    # Run load test
    if [ "$USE_AB" = true ]; then
        run_ab_test
    else
        run_curl_test
    fi
    
    # Wait a moment for metrics to settle
    sleep 5
    
    # Get final metrics
    get_final_metrics
    
    # Analyze results
    analyze_results
    
    # Show AB results
    show_ab_results
    
    echo -e "${GREEN}🎉 Performance testing complete!${NC}"
    echo -e "${BLUE}💡 Check the performance dashboard for real-time metrics${NC}"
}

# Run main function
main "$@" 