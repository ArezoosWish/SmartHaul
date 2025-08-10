#!/bin/bash

echo "🔍 Testing PostgreSQL Connection from Docker"
echo "============================================"

# Test different host configurations
echo "Testing host.docker.internal:5432..."
docker exec smarthaul-n8n nc -zv host.docker.internal 5432

echo -e "\nTesting localhost:5432..."
docker exec smarthaul-n8n nc -zv localhost 5432

echo -e "\nTesting 172.20.10.2:5432..."
docker exec smarthaul-n8n nc -zv 172.20.10.2 5432

echo -e "\n✅ Connection tests complete!"
echo -e "💡 Use the host that shows 'open' in the results above" 