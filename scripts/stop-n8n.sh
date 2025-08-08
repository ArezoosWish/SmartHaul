#!/bin/bash

# SmartHaul N8N Stop Script
# This script stops the N8N services

set -e

echo "🛑 Stopping SmartHaul N8N Services..."

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

# Stop services
echo "📦 Stopping N8N, PostgreSQL, and Redis containers..."
docker-compose down

echo "✅ N8N Services stopped successfully!"
echo ""
echo "💾 Data is preserved in Docker volumes:"
echo "   - n8n_data: N8N workflows and settings"
echo "   - postgres_data: PostgreSQL data"
echo "   - redis_data: Redis cache data"
echo ""
echo "🗑️  To remove all data: docker-compose down -v" 