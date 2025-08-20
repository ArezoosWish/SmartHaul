#!/bin/bash

# Test script to verify N8N can connect to the SmartHaul database
echo "🔍 Testing N8N Database Connection..."
echo "====================================="

# Check if containers are running
echo "📊 Step 1: Checking container status..."
docker ps | grep -E "(smarthaul-n8n|smarthaul-database)"

echo -e "\n📊 Step 2: Testing database connectivity from N8N container..."
docker exec smarthaul-n8n ping -c 2 smarthaul-database

echo -e "\n📊 Step 3: Testing database port accessibility..."
docker exec smarthaul-n8n nc -zv smarthaul-database 5432

echo -e "\n📊 Step 4: Testing direct database connection from N8N container..."
docker exec smarthaul-n8n sh -c "apt-get update > /dev/null 2>&1 && apt-get install -y postgresql-client > /dev/null 2>&1 && PGPASSWORD=smarthaul_password psql -h smarthaul-database -U wishsol -d smarthaul -c 'SELECT COUNT(*) FROM shipments;'"

echo -e "\n📊 Step 5: Checking N8N environment variables..."
docker exec smarthaul-n8n env | grep -E "(SMART_HAUL|POSTGRES|DATABASE)"

echo -e "\n📊 Step 6: Checking N8N logs for connection errors..."
docker logs smarthaul-n8n --tail 20 | grep -i -E "(error|connection|database|postgres)"

echo -e "\n✅ Connection test completed!"
echo ""
echo "🔧 If there are connection issues, you need to:"
echo "1. Open N8N at http://localhost:5679"
echo "2. Login with admin/smarthaul123"
echo "3. Go to Settings > Credentials"
echo "4. Add PostgreSQL credential:"
echo "   - Name: SmartHaul Database"
echo "   - Host: smarthaul-database"
echo "   - Port: 5432"
echo "   - Database: smarthaul"
echo "   - User: wishsol"
echo "   - Password: smarthaul_password" 