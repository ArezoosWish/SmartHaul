#!/bin/bash

echo "🧪 Testing SmartHaul N8N Workflow"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if N8N is running
echo -e "${BLUE}📡 Checking N8N status...${NC}"
if curl -s http://localhost:5679 > /dev/null; then
    echo -e "${GREEN}✅ N8N is running on http://localhost:5679${NC}"
else
    echo -e "${RED}❌ N8N is not accessible${NC}"
    exit 1
fi

# Check database connection
echo -e "${BLUE}🗄️  Testing database connection...${NC}"
if psql -d smarthaul -c "SELECT COUNT(*) FROM shipments;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi

# Show current data
echo -e "${BLUE}📊 Current database state:${NC}"
echo "Shipments:"
psql -d smarthaul -c "SELECT id, tracking_number, status, eta FROM shipments LIMIT 5;"

echo -e "\nDelivery Events:"
psql -d smarthaul -c "SELECT id, shipment_id, event_type, timestamp FROM delivery_events ORDER BY timestamp DESC LIMIT 5;"

echo -e "\nTrucks:"
psql -d smarthaul -c "SELECT id, plate_number, status FROM trucks;"

# Test workflow execution
echo -e "${BLUE}🚀 Testing workflow execution...${NC}"
echo -e "${YELLOW}📝 To test the workflow:${NC}"
echo "1. Go to http://localhost:5679"
echo "2. Import the realistic-logistics-workflow.json"
echo "3. Configure PostgreSQL credentials (host: host.docker.internal)"
echo "4. Click 'Execute workflow' button"
echo "5. Check the execution logs"

# Monitor for new events
echo -e "${BLUE}👀 Monitoring for new events...${NC}"
echo -e "${YELLOW}📊 Current delivery events count:${NC}"
CURRENT_COUNT=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM delivery_events;")
echo "Events: $CURRENT_COUNT"

echo -e "\n${GREEN}✅ Test setup complete!${NC}"
echo -e "${YELLOW}💡 After running the workflow, check for new delivery events${NC}"
echo -e "${YELLOW}💡 The workflow should create events for delays, maintenance, urgent deliveries, and daily reports${NC}" 