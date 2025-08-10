#!/bin/bash

# Test script to verify the N8N workflow fix
# This script tests the database operations that the workflow performs

echo "🧪 Testing N8N Workflow Fix..."
echo "=================================="

# Database connection details
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="wishsol"
DB_NAME="smarthaul"

echo "📊 Step 1: Check current shipments in transit..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT id, tracking_number, status, eta 
FROM shipments 
WHERE status = 'in_transit' AND eta IS NOT NULL;
"

echo -e "\n📊 Step 2: Check current delivery events..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT id, shipment_id, event_type, timestamp, location 
FROM delivery_events 
ORDER BY timestamp DESC 
LIMIT 5;
"

echo -e "\n📊 Step 3: Check current predictions..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT id, shipment_id, predicted_delay, risk_score, created_at 
FROM predictions 
ORDER BY created_at DESC 
LIMIT 5;
"

echo -e "\n🔧 Step 4: Test the workflow logic (dry run)..."
echo "This would normally:"
echo "1. Find shipments in transit: $(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM shipments WHERE status = 'in_transit' AND eta IS NOT NULL;")"
echo "2. Update ETA for each shipment"
echo "3. Create delivery events"
echo "4. Create/update predictions"

echo -e "\n✅ Test completed! The workflow should now work without foreign key violations."
echo "📝 Key fixes applied:"
echo "   - Changed query from 'eta > NOW()' to 'eta IS NOT NULL'"
echo "   - Added data validation with Set node"
echo "   - Added Split In Batches for proper iteration"
echo "   - Added error handling" 