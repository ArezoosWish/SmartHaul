#!/bin/bash

echo "📊 SmartHaul Database Monitor"
echo "============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Get initial counts
INITIAL_SHIPMENTS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM shipments;" | tr -d ' ')
INITIAL_EVENTS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM delivery_events;" | tr -d ' ')
INITIAL_PREDICTIONS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM predictions;" | tr -d ' ')

echo -e "${BLUE}📈 Initial Database State:${NC}"
echo "Shipments: $INITIAL_SHIPMENTS"
echo "Delivery Events: $INITIAL_EVENTS"
echo "Predictions: $INITIAL_PREDICTIONS"

echo -e "\n${YELLOW}👀 Monitoring for changes...${NC}"
echo "Press Ctrl+C to stop monitoring"

# Monitor loop
while true; do
    clear
    echo -e "${BLUE}📊 SmartHaul Database Monitor - $(date)${NC}"
    echo "================================================"
    
    # Current counts
    CURRENT_SHIPMENTS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM shipments;" | tr -d ' ')
    CURRENT_EVENTS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM delivery_events;" | tr -d ' ')
    CURRENT_PREDICTIONS=$(psql -d smarthaul -t -c "SELECT COUNT(*) FROM predictions;" | tr -d ' ')
    
    echo -e "${BLUE}📈 Current Database State:${NC}"
    echo "Shipments: $CURRENT_SHIPMENTS"
    echo "Delivery Events: $CURRENT_EVENTS"
    echo "Predictions: $CURRENT_PREDICTIONS"
    
    # Show changes
    echo -e "\n${GREEN}🆕 New Events (Last 5):${NC}"
    psql -d smarthaul -c "SELECT id, shipment_id, event_type, notes, timestamp FROM delivery_events ORDER BY timestamp DESC LIMIT 5;"
    
    echo -e "\n${YELLOW}📦 Active Shipments:${NC}"
    psql -d smarthaul -c "SELECT id, tracking_number, status, eta FROM shipments WHERE status IN ('in_transit', 'pending') ORDER BY eta;"
    
    echo -e "\n${BLUE}🚛 Truck Status:${NC}"
    psql -d smarthaul -c "SELECT id, plate_number, status FROM trucks;"
    
    echo -e "\n${YELLOW}⏰ Refreshing in 5 seconds... (Ctrl+C to stop)${NC}"
    sleep 5
done 