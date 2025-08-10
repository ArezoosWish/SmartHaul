#!/bin/bash

echo "🔍 Verifying Workflow Results"
echo "============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get initial count
INITIAL_COUNT=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM delivery_events;" | tr -d ' ')

echo -e "${BLUE}📊 Initial delivery events count: $INITIAL_COUNT${NC}"

echo -e "\n${YELLOW}⏳ Waiting for workflow execution...${NC}"
echo "Please run the workflow in N8N and press Enter when done"
read -p "Press Enter to continue..."

# Get final count
FINAL_COUNT=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM delivery_events;" | tr -d ' ')

echo -e "\n${BLUE}📊 Final delivery events count: $FINAL_COUNT${NC}"

# Calculate difference
DIFFERENCE=$((FINAL_COUNT - INITIAL_COUNT))

if [ $DIFFERENCE -gt 0 ]; then
    echo -e "${GREEN}✅ SUCCESS! $DIFFERENCE new events created${NC}"
else
    echo -e "${YELLOW}⚠️  No new events created${NC}"
fi

# Show new events
echo -e "\n${BLUE}🆕 New delivery events:${NC}"
psql -d smarthaul -c "SELECT id, shipment_id, event_type, notes, timestamp FROM delivery_events ORDER BY timestamp DESC LIMIT $DIFFERENCE;"

# Check for specific event types
echo -e "\n${BLUE}🔍 Checking for specific event types:${NC}"

DELAY_EVENTS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM delivery_events WHERE event_type = 'delay_alert';" | tr -d ' ')
MAINTENANCE_EVENTS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM delivery_events WHERE event_type = 'truck_maintenance';" | tr -d ' ')
URGENT_EVENTS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM delivery_events WHERE event_type = 'urgent_delivery';" | tr -d ' ')
DAILY_REPORTS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM delivery_events WHERE event_type = 'daily_report';" | tr -d ' ')

echo "Delay alerts: $DELAY_EVENTS"
echo "Maintenance events: $MAINTENANCE_EVENTS"
echo "Urgent deliveries: $URGENT_EVENTS"
echo "Daily reports: $DAILY_REPORTS"

echo -e "\n${GREEN}🎉 Verification complete!${NC}" 